"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import MDXComponent from "@/components/ui/mdx-components"
import { cn } from "@/lib/utils"
import { Send, Bot, User, Loader2, Sparkles, FileSearch, Wrench } from "lucide-react"
import { MicButton, TtsToggle } from "./voice-controls"
import { useSpeechSynthesis } from "./use-voice"

const RATE_LIMIT = 10
const RATE_WINDOW = 60 * 1000

interface Source {
  sourceType: string
  sourceId: string
  score: number
}
interface ToolCall {
  name: string
  args: Record<string, unknown>
}
interface Meta {
  sources: Source[]
  tools: ToolCall[]
}
type Message = { id: string; msg: string; role: "user" | "model"; meta?: Meta }

const SUGGESTIONS = [
  "What AI/LLM projects have you built?",
  "Summarize your work experience.",
  "What's your strongest tech stack?",
]

function parseMeta(raw: string): Meta | undefined {
  const m = raw.match(/<!--meta:([\s\S]*?)-->/)
  if (!m) return undefined
  try {
    return JSON.parse(m[1]) as Meta
  } catch {
    return undefined
  }
}

function SourceChips({ sources }: { sources: Source[] }) {
  if (!sources?.length) return null
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5">
      <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
        <FileSearch className="h-3 w-3" /> Retrieved
      </span>
      {sources.map((s, i) => {
        const label = `${s.sourceType} · ${Math.round(s.score * 100)}%`
        const chip = (
          <Badge variant="secondary" className="gap-1 px-1.5 py-0 text-[11px] font-normal capitalize">
            {label}
          </Badge>
        )
        return s.sourceType === "project" ? (
          <Link key={`${s.sourceId}-${i}`} href={`/project/${s.sourceId}`} className="hover:opacity-80">
            {chip}
          </Link>
        ) : (
          <span key={`${s.sourceId}-${i}`}>{chip}</span>
        )
      })}
    </div>
  )
}

function ToolTrace({ tools }: { tools: ToolCall[] }) {
  if (!tools?.length) return null
  return (
    <details className="mt-2 text-[11px] text-muted-foreground">
      <summary className="flex cursor-pointer items-center gap-1 font-medium">
        <Wrench className="h-3 w-3" /> Agent steps ({tools.length})
      </summary>
      <div className="mt-1 space-y-0.5 border-l-2 border-border/50 pl-2">
        {tools.map((t, i) => (
          <div key={`${t.name}-${i}`} className="font-mono">
            called <span className="text-foreground/80">{t.name}</span>({JSON.stringify(t.args)})
          </div>
        ))}
      </div>
    </details>
  )
}

export default function PublicAIChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [timestamps, setTimestamps] = useState<number[]>([])
  const [now, setNow] = useState(0)
  const [ttsOn, setTtsOn] = useState(false)
  const tts = useSpeechSynthesis()

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const recent = timestamps.filter((t) => now - t < RATE_WINDOW)
  const remaining = Math.max(0, RATE_LIMIT - recent.length)
  const cooldown = remaining > 0 || recent.length === 0 ? 0 : Math.ceil((RATE_WINDOW - (now - Math.min(...recent))) / 1000)

  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading])

  const ask = async (raw: string) => {
    const text = raw.trim()
    if (!text || loading) return
    if (remaining <= 0) {
      toast.error(`Rate limit — wait ${cooldown}s before asking again.`)
      return
    }

    const sentAt = Date.now()
    const userMsg: Message = { id: `u-${sentAt}`, msg: text, role: "user" }
    const aiId = `m-${sentAt}`
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setTimestamps((prev) => [...prev, sentAt])
    setLoading(true)

    let full = ""
    let reader: ReadableStreamDefaultReader<Uint8Array> | null = null
    try {
      const res = await fetch("/api/ai/public", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
      const ct = res.headers.get("content-type") ?? ""
      if (!res.ok || ct.includes("application/json")) {
        const json = await res.json().catch(() => null)
        throw new Error(json?.message || `AI request failed (${res.status})`)
      }

      setMessages((prev) => [...prev, { id: aiId, msg: "", role: "model" }])
      reader = res.body!.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        full += decoder.decode(value, { stream: true })
        const display = full.replace(/<!--meta:[\s\S]*?-->/, "")
        setMessages((prev) => prev.map((m) => (m.id === aiId ? { ...m, msg: display } : m)))
      }
      full += decoder.decode()

      const meta = parseMeta(full)
      const finalText = full.replace(/<!--meta:[\s\S]*?-->/, "").trim()
      setMessages((prev) => prev.map((m) => (m.id === aiId ? { ...m, msg: finalText, meta } : m)))
      if (ttsOn) tts.speak(finalText)
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id && m.id !== aiId))
      setInput(text)
      setTimestamps((prev) => prev.filter((t) => t !== sentAt))
      toast.error(err instanceof Error ? err.message : "Failed to send message.")
    } finally {
      reader?.cancel().catch(() => {})
      setLoading(false)
    }
  }

  return (
    <div className="flex h-[60vh] min-h-[420px] flex-col">
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-1 py-2">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <p className="font-semibold">Ask my portfolio anything</p>
              <p className="mt-1 text-sm text-muted-foreground">Grounded in my real projects & experience via RAG — with cited sources and visible agent steps.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => ask(s)} className="rounded-full border border-border/60 bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={cn("flex gap-2.5", m.role === "user" ? "flex-row-reverse" : "flex-row")}>
              <Avatar className="h-8 w-8 shrink-0">
                <AvatarFallback className={cn(m.role === "user" ? "bg-muted" : "bg-primary/10 text-primary")}>
                  {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              <div className={cn("min-w-0 max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm", m.role === "user" ? "rounded-tr-sm bg-primary/10" : "rounded-tl-sm bg-muted/60")}>
                {m.role === "model" ? (
                  <>
                    {m.msg ? <MDXComponent>{m.msg}</MDXComponent> : <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                    {m.meta && <SourceChips sources={m.meta.sources} />}
                    {m.meta && <ToolTrace tools={m.meta.tools} />}
                  </>
                ) : (
                  <p className="whitespace-pre-wrap break-words">{m.msg}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          ask(input)
        }}
        className="flex items-center gap-2 border-t border-border/60 pt-3"
      >
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={remaining <= 0 ? `Rate limited — wait ${cooldown}s…` : "Ask about my projects, work, skills…"}
          maxLength={600}
          disabled={loading || remaining <= 0}
          className="h-11 rounded-full"
        />
        <MicButton onTranscript={(t) => setInput((p) => (p ? `${p} ${t}` : t))} disabled={loading || remaining <= 0} />
        {tts.supported && (
          <TtsToggle on={ttsOn} onToggle={() => { const n = !ttsOn; setTtsOn(n); if (!n) tts.cancel() }} />
        )}
        <Button type="submit" size="icon" className="h-11 w-11 shrink-0 rounded-full" disabled={loading || !input.trim() || remaining <= 0}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  )
}
