"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { toast } from "sonner"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Sparkles, Loader2, ArrowUp, FileSearch, X, Copy, Check } from "lucide-react"

interface Source {
  sourceType: string
  sourceId: string
  score: number
}

const SAMPLES = ["Tell me about your work experience", "What projects have you shipped?", "What's your educational background?"]

/** Compact markdown renderer for the answer — readable but tight (no Typography.P's leading-7). */
function AnswerMarkdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: (props) => <p className="my-1.5 text-[13px] leading-relaxed first:mt-0 last:mb-0" {...props} />,
        ul: (props) => <ul className="my-1.5 list-disc space-y-0.5 pl-4 text-[13px] leading-relaxed" {...props} />,
        ol: (props) => <ol className="my-1.5 list-decimal space-y-0.5 pl-4 text-[13px] leading-relaxed" {...props} />,
        li: (props) => <li className="marker:text-muted-foreground" {...props} />,
        a: (props) => <a className="text-primary underline-offset-2 hover:underline" target="_blank" rel="noreferrer" {...props} />,
        strong: (props) => <strong className="font-semibold" {...props} />,
        em: (props) => <em className="italic" {...props} />,
        code: (props) => <code className="rounded bg-muted px-1 py-0.5 font-mono text-[12px]" {...props} />,
        h1: (props) => <p className="mb-1 mt-2 text-sm font-semibold first:mt-0" {...props} />,
        h2: (props) => <p className="mb-1 mt-2 text-sm font-semibold first:mt-0" {...props} />,
        h3: (props) => <p className="mb-1 mt-2 text-sm font-semibold first:mt-0" {...props} />,
      }}
    >
      {children}
    </ReactMarkdown>
  )
}

function ThinkingDots() {
  return (
    <span className="flex items-center gap-1 py-1">
      {[0, 150, 300].map((d) => (
        <span key={d} className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: `${d}ms` }} />
      ))}
    </span>
  )
}

export default function AskResumeLauncher() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState("")
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState<string | null>(null)
  const [sources, setSources] = useState<Source[]>([])
  const [copied, setCopied] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const ask = useCallback(
    async (raw: string) => {
      const question = raw.trim()
      if (!question || loading) return
      setLoading(true)
      setAnswer(null)
      setSources([])
      try {
        const res = await fetch("/api/ai/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        })
        const json = await res.json().catch(() => null)
        if (!res.ok || json?.status >= 400) throw new Error(json?.message || `Failed (${res.status})`)
        setAnswer(json.data.answer)
        setSources(json.data.sources ?? [])
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to get an answer.")
      } finally {
        setLoading(false)
      }
    },
    [loading],
  )

  const copyAnswer = useCallback(() => {
    if (!answer) return
    navigator.clipboard
      .writeText(answer)
      .then(() => {
        setCopied(true)
        toast.success("Answer copied")
        setTimeout(() => setCopied(false), 1500)
      })
      .catch(() => toast.error("Could not copy"))
  }, [answer])

  // Shift+/ ("?") toggles the launcher; Escape closes it. Ignore "?" while typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        return
      }
      const el = e.target as HTMLElement | null
      const typing = !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable)
      if (!typing && (e.key === "?" || (e.shiftKey && e.key === "/"))) {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [open])

  return (
    <div
      ref={containerRef}
      className="fixed bottom-36 right-6 z-[10000] print:hidden sm:bottom-5 sm:left-1/2 sm:right-auto sm:-translate-x-1/2"
    >
      {open && (
        <div className="absolute bottom-full right-0 mb-3 flex max-h-[calc(100dvh-14rem)] w-[min(calc(100vw-3rem),24rem)] flex-col overflow-hidden rounded-xl border border-primary/20 bg-card/95 shadow-2xl backdrop-blur supports-[backdrop-filter]:bg-card/80 sm:left-1/2 sm:right-auto sm:max-h-[calc(100dvh-7rem)] sm:-translate-x-1/2">
          <div className="flex shrink-0 items-center gap-2.5 border-b border-border/50 bg-gradient-to-br from-primary/[0.08] to-transparent px-3.5 py-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-tight">Ask my resume</p>
              <p className="text-[11px] text-muted-foreground">Grounded in my real projects &amp; experience.</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-y-auto p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                ask(q)
              }}
              className="relative"
            >
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="e.g. What AI projects have you shipped?"
                maxLength={300}
                disabled={loading}
                className="h-10 w-full rounded-lg border border-border/60 bg-background pl-3.5 pr-11 text-sm outline-none transition-colors focus:border-primary/50 focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-md"
                disabled={loading || !q.trim()}
                aria-label="Ask"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowUp className="h-4 w-4" />}
              </Button>
            </form>

            {!answer && !loading && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {SAMPLES.map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setQ(s)
                      ask(s)
                    }}
                    className="rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-muted hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {(loading || answer) && (
              <div className="relative mt-2.5 rounded-lg border border-border/50 bg-background/60 p-3">
                {loading ? (
                  <ThinkingDots />
                ) : (
                  <>
                    <button
                      onClick={copyAnswer}
                      className="absolute right-1.5 top-1.5 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label="Copy answer"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                    <div className="pr-5">
                      <AnswerMarkdown>{answer ?? ""}</AnswerMarkdown>
                    </div>
                    {sources.length > 0 && (
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-border/40 pt-2">
                        <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                          <FileSearch className="h-3 w-3" /> Sources
                        </span>
                        {sources.map((src, i) => {
                          const chip = (
                            <Badge variant="secondary" className={cn("gap-1 px-1.5 py-0 text-[11px] font-normal capitalize")}>
                              {src.sourceType} · {Math.round(src.score * 100)}%
                            </Badge>
                          )
                          return src.sourceType === "project" ? (
                            <Link key={`${src.sourceId}-${i}`} href={`/project/${src.sourceId}`} className="hover:opacity-80">
                              {chip}
                            </Link>
                          ) : (
                            <span key={`${src.sourceId}-${i}`}>{chip}</span>
                          )
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Ask my resume"
        aria-expanded={open}
        className={cn(
          "flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60 p-3 text-primary-foreground shadow-lg transition-colors",
          "sm:justify-start sm:gap-3 sm:rounded-xl sm:border sm:bg-card/95 sm:bg-none sm:px-3 sm:py-2.5 sm:text-left sm:text-foreground sm:backdrop-blur sm:supports-[backdrop-filter]:bg-card/80",
          open ? "sm:border-primary/40" : "sm:border-border/60 sm:hover:border-primary/30",
        )}
      >
        <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60 text-primary-foreground shadow-sm sm:flex">
          <Sparkles className="h-5 w-5" />
        </span>
        <Sparkles className="h-5 w-5 sm:hidden" />
        <span className="hidden min-w-0 flex-1 sm:block">
          <span className="block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Ask my resume</span>
          <span className="block truncate text-sm font-semibold">Ask about my experience</span>
        </span>
        <kbd className="pointer-events-none hidden shrink-0 select-none items-center gap-1 rounded border bg-background px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-flex">
          Shift /
        </kbd>
      </button>
    </div>
  )
}
