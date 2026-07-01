"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { renameAIChat, deleteAIChat } from "@/services/user/ai"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import MDXComponent from "@/components/ui/mdx-components"
import { cn } from "@/lib/utils"
import { Send, Plus, Bot, User, Loader2, MessageSquare, Sparkles, Clock, Pencil, Trash2 } from "lucide-react"
import { MicButton, TtsToggle } from "./voice-controls"
import { useSpeechSynthesis } from "./use-voice"

const RATE_LIMIT = 10
const RATE_WINDOW = 60 * 1000

type Message = { id: string; msg: string; role: string; createdAt?: string }
type Session = { id: string; title: string; createdAt?: string; messages: Message[] }

export default function AIChatApp({ initialSessions }: { initialSessions: Session[] }) {
  const [sessions, setSessions] = useState<Session[]>(initialSessions ?? [])
  const [activeChatId, setActiveChatId] = useState<string | undefined>()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [timestamps, setTimestamps] = useState<number[]>([])
  const [now, setNow] = useState(() => 0)
  const [ttsOn, setTtsOn] = useState(false)
  const tts = useSpeechSynthesis()

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Tick once per second only while rate-limited, to update the countdown.
  const recent = timestamps.filter((t) => now - t < RATE_WINDOW)
  const remaining = Math.max(0, RATE_LIMIT - recent.length)
  const cooldown = remaining > 0 || recent.length === 0
    ? 0
    : Math.ceil((RATE_WINDOW - (now - Math.min(...recent))) / 1000)

  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  // Scroll only the message container (never the window), instantly to avoid jank.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading])

  const selectSession = useCallback((s: Session) => {
    setActiveChatId(s.id)
    setMessages(s.messages ?? [])
    setTimeout(() => inputRef.current?.focus(), 0)
  }, [])

  const newChat = useCallback(() => {
    setActiveChatId(undefined)
    setMessages([])
    setInput("")
    setTimeout(() => inputRef.current?.focus(), 0)
  }, [])

  const handleRename = async (s: Session) => {
    const name = window.prompt("Rename chat", s.title)?.trim()
    if (!name || name === s.title) return
    try {
      await renameAIChat(s.id, name)
      setSessions((prev) => prev.map((x) => (x.id === s.id ? { ...x, title: name } : x)))
      toast.success("Chat renamed")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to rename chat")
    }
  }

  const handleDelete = async (s: Session) => {
    if (!window.confirm(`Delete "${s.title || "this chat"}"? This cannot be undone.`)) return
    try {
      await deleteAIChat(s.id)
      setSessions((prev) => prev.filter((x) => x.id !== s.id))
      if (activeChatId === s.id) {
        setActiveChatId(undefined)
        setMessages([])
      }
      toast.success("Chat deleted")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete chat")
    }
  }

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading) return

    if (remaining <= 0) {
      toast.error(`Rate limit — wait ${cooldown}s before sending again.`)
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
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, chatId: activeChatId }),
      })

      const ct = res.headers.get("content-type") ?? ""
      if (!res.ok || ct.includes("application/json")) {
        const json = await res.json().catch(() => null)
        throw new Error(json?.message || `AI request failed (${res.status})`)
      }

      // Empty AI bubble that fills in as chunks stream in.
      setMessages((prev) => [...prev, { id: aiId, msg: "", role: "model" }])

      reader = res.body!.getReader()
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        full += decoder.decode(value, { stream: true })
        const display = full.replace(/<!--chatId:[^>]*-->/, "")
        setMessages((prev) => prev.map((m) => (m.id === aiId ? { ...m, msg: display } : m)))
      }
      full += decoder.decode()

      const chatIdMatch = full.match(/<!--chatId:([^>]+)-->/)
      const finalText = full.replace(/<!--chatId:[^>]*-->/, "").trim()
      setMessages((prev) => prev.map((m) => (m.id === aiId ? { ...m, msg: finalText } : m)))
      if (ttsOn) tts.speak(finalText)

      const aiMsg: Message = { id: aiId, msg: finalText, role: "model" }
      const chatId = chatIdMatch?.[1] ?? activeChatId
      if (chatId) {
        setActiveChatId(chatId)
        setSessions((prev) => {
          const existing = prev.find((s) => s.id === chatId)
          if (existing) {
            return prev.map((s) =>
              s.id === chatId ? { ...s, messages: [...s.messages, userMsg, aiMsg] } : s
            )
          }
          return [
            { id: chatId, title: text.slice(0, 60), createdAt: new Date().toISOString(), messages: [userMsg, aiMsg] },
            ...prev,
          ]
        })
      }
    } catch (err) {
      // Remove the optimistic messages so the user can retry cleanly, and roll back
      // the consumed rate-limit slot since the request never succeeded.
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
    <div className="flex h-[calc(100dvh-16rem)] min-h-[460px] flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
      {/* mac window title bar */}
      <div className="flex shrink-0 items-center gap-3 border-b bg-muted/40 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-red-400/90" />
          <span className="h-3 w-3 rounded-full bg-yellow-400/90" />
          <span className="h-3 w-3 rounded-full bg-green-400/90" />
        </div>
        <p className="flex-1 truncate text-center font-mono text-xs text-muted-foreground">etan-ai ~ chat</p>
        <div className="w-[46px] shrink-0" aria-hidden />
      </div>
      <div className="flex min-h-0 flex-1">
      {/* Sessions sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r bg-muted/30 md:flex">
        <div className="border-b p-3">
          <Button onClick={newChat} className="w-full gap-2">
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
        <div className="flex-1 space-y-1 overflow-y-auto p-2">
          {sessions.length === 0 ? (
            <p className="px-3 py-6 text-center text-xs text-muted-foreground">No conversations yet</p>
          ) : (
            sessions.map((s) => (
              <div
                key={s.id}
                className={cn(
                  "group/item flex items-center rounded-lg pr-1 transition-colors hover:bg-muted",
                  activeChatId === s.id && "bg-muted",
                )}
              >
                <button onClick={() => selectSession(s)} className="min-w-0 flex-1 rounded-lg p-2.5 text-left">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate text-sm font-medium">{s.title || "Conversation"}</span>
                  </div>
                  <span className="ml-6 block text-xs text-muted-foreground">{s.messages?.length ?? 0} messages</span>
                </button>
                <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity focus-within:opacity-100 group-hover/item:opacity-100">
                  <button onClick={() => handleRename(s)} title="Rename" aria-label="Rename chat" className="rounded p-1.5 text-muted-foreground hover:bg-background hover:text-foreground">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => handleDelete(s)} title="Delete" aria-label="Delete chat" className="rounded p-1.5 text-muted-foreground hover:bg-background hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Conversation */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 border-b p-3">
          <Avatar className="h-9 w-9 border bg-gradient-to-br from-violet-500/20 to-purple-500/20">
            <AvatarFallback>
              <Bot className="h-5 w-5 text-violet-500" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Etan AI</p>
            <p className="text-xs text-muted-foreground">Portfolio assistant</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Badge variant="secondary" className="hidden gap-1 text-xs sm:flex">
              <Clock className="h-3 w-3" />
              {remaining}/{RATE_LIMIT}
            </Badge>
            <Button onClick={newChat} variant="ghost" size="sm" className="gap-1 md:hidden">
              <Plus className="h-4 w-4" />
              New
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 && !loading ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
              <div className="rounded-full bg-primary/10 p-4">
                <Sparkles className="h-7 w-7 text-primary" />
              </div>
              <p className="font-medium text-foreground">Start a conversation</p>
              <p className="max-w-sm text-sm">Ask Etan anything about Rizky&apos;s projects, skills, or background.</p>
            </div>
          ) : (
            messages.map((m) => (
              <div key={m.id} className={cn("flex gap-3", m.role === "user" ? "flex-row-reverse" : "flex-row")}>
                <Avatar className="h-8 w-8 shrink-0 border">
                  <AvatarFallback>
                    {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-violet-500" />}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={cn(
                    "max-w-[78%] rounded-2xl px-4 py-2.5 text-sm",
                    m.role === "user"
                      ? "rounded-tr-sm bg-primary text-primary-foreground"
                      : "rounded-tl-sm bg-muted",
                  )}
                >
                  {m.role === "user" ? (
                    <p className="whitespace-pre-wrap">{m.msg}</p>
                  ) : (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <MDXComponent>{m.msg}</MDXComponent>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {loading && messages[messages.length - 1]?.role !== "model" && (
            <div className="flex gap-3">
              <Avatar className="h-8 w-8 shrink-0 border">
                <AvatarFallback>
                  <Bot className="h-4 w-4 text-violet-500" />
                </AvatarFallback>
              </Avatar>
              <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-muted px-4 py-3 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Etan is thinking…
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={send} className="flex items-center gap-2 border-t p-3">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={remaining <= 0 ? `Rate limited — wait ${cooldown}s…` : "Say something…"}
            disabled={loading || remaining <= 0}
            className="h-11 rounded-full"
            autoComplete="off"
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
      </div>
    </div>
  )
}
