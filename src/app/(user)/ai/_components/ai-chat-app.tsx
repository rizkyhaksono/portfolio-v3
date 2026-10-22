"use client"

import { useState, useRef, useEffect } from "react"
import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { toast } from "sonner"
import { getAIChatById, renameAIChat, deleteAIChat, type AIChatMessage, type AIChatSession } from "@/services/user/ai"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InkLink } from "@/components/ui/ink-link"
import { Pre } from "@/components/ui/code-block"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"
import { track } from "@/lib/analytics"
import { MicButton, TtsToggle } from "./voice-controls"
import { useSpeechSynthesis } from "./use-voice"
import { ErrorNote } from "./error-note"
import { setQuery } from "./set-query"

const RATE_LIMIT = 10
const RATE_WINDOW = 60 * 1000

type Message = AIChatMessage
type Session = AIChatSession
type ChatError = { message: string; signIn?: boolean }
type PendingAction = { kind: "rename" | "delete"; session: Session }
// `open` is separate so the dialog keeps its text while it fades out.
type Pending = PendingAction & { open: boolean }

const MARKDOWN: Components = {
  pre: Pre,
  a: ({ href = "", children }) => (
    <InkLink href={href} external={/^https?:\/\//.test(href)}>
      {children}
    </InkLink>
  ),
}

const sendStatus = (status: number) => (status === 401 ? "expired" : status === 429 ? "limited" : status === 404 ? "missing" : "error")

function Letter({ m }: Readonly<{ m: Message }>) {
  if (m.role === "user") {
    return (
      <div>
        <p className="text-small font-semibold text-ink">You</p>
        <p className="mt-1 whitespace-pre-wrap break-words text-body text-ink">{m.msg}</p>
      </div>
    )
  }
  return (
    <div className="border-l border-ink pl-4">
      <p className="text-small font-semibold text-ink">Etan</p>
      {m.msg ? (
        <div className="prose prose--chat mt-1 break-words">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={MARKDOWN}>
            {m.msg}
          </ReactMarkdown>
        </div>
      ) : (
        <p className="mt-1 font-display text-caption text-ink-soft">Writing…</p>
      )}
    </div>
  )
}

function SessionList({
  sessions,
  activeId,
  busy,
  onSelect,
  onPending,
}: Readonly<{
  sessions: Session[]
  activeId?: string
  /** True while Etan writes: the reply belongs to the open chat, so no other chat may open or change. */
  busy: boolean
  onSelect: (s: Session) => void
  onPending: (p: PendingAction) => void
}>) {
  if (sessions.length === 0) {
    return <p className="p-3 font-display text-caption text-ink-soft">No conversations yet. Your first message starts one.</p>
  }
  const action = "underline-offset-[0.18em] hover:underline disabled:no-underline disabled:opacity-60 [@media(pointer:coarse)]:min-h-11"
  return (
    <ul role="list" className="divide-y divide-rule border-b border-rule">
      {sessions.map((s) => {
        const count = s.messages?.length ?? s.messageCount ?? 0
        return (
          <li key={s.id} className={cn("px-3 py-2.5", s.id === activeId && "bg-tint")}>
            <button
              type="button"
              onClick={() => onSelect(s)}
              disabled={busy}
              aria-current={s.id === activeId || undefined}
              className="block w-full truncate text-left text-small font-semibold text-ink underline-offset-[0.18em] hover:underline disabled:no-underline [@media(pointer:coarse)]:min-h-11"
            >
              {s.title || "Untitled conversation"}
            </button>
            <div className="mt-0.5 flex items-center gap-3 text-caption text-ink-soft">
              <span className="font-display tabular-nums">
                {count} {count === 1 ? "message" : "messages"}
              </span>
              <button type="button" disabled={busy} onClick={() => onPending({ kind: "rename", session: s })} className={cn("ml-auto", action)}>
                Rename<span className="sr-only"> {s.title || "Untitled conversation"}</span>
              </button>
              <button type="button" disabled={busy} onClick={() => onPending({ kind: "delete", session: s })} className={action}>
                Delete<span className="sr-only"> {s.title || "Untitled conversation"}</span>
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

/** Correspondence: saved conversations beside a letters column, replies set behind a left rule. */
function openingError(chatId: string | undefined, listed: boolean, loaded: boolean): ChatError | null {
  if (!chatId || loaded) return null
  return {
    message: listed
      ? "That conversation did not open. Pick it from the list, or write below to start a new one."
      : "That chat no longer exists. Write below to start a new one.",
  }
}

export default function AIChatApp({
  initialSessions,
  initialChatId,
  initialMessages,
}: Readonly<{ initialSessions: Session[]; initialChatId?: string; initialMessages?: Message[] }>) {
  const opened = initialSessions.find((s) => s.id === initialChatId)
  const openedMessages = initialMessages ?? opened?.messages
  const [sessions, setSessions] = useState<Session[]>(initialSessions)
  const [activeChatId, setActiveChatId] = useState<string | undefined>(opened && openedMessages ? opened.id : undefined)
  const [messages, setMessages] = useState<Message[]>(opened ? (openedMessages ?? []) : [])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [opening, setOpening] = useState(false)
  const [sent, setSent] = useState<number[]>([])
  const [now, setNow] = useState(0)
  const [ttsOn, setTtsOn] = useState(false)
  const [error, setError] = useState<ChatError | null>(() => openingError(initialChatId, Boolean(opened), Boolean(opened && openedMessages)))
  const [sheetOpen, setSheetOpen] = useState(false)
  const [pending, setPending] = useState<Pending | null>(null)
  const tts = useSpeechSynthesis()

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const openRequest = useRef(0)
  const stream = useRef<AbortController | null>(null)

  useEffect(() => () => stream.current?.abort(), [])

  const recent = sent.filter((t) => now - t < RATE_WINDOW)
  const remaining = Math.max(0, RATE_LIMIT - recent.length)
  const reopensAt = remaining > 0 ? null : Math.min(...recent) + RATE_WINDOW

  // Re-render once when the oldest message leaves the window, instead of ticking every second.
  useEffect(() => {
    const live = sent.filter((t) => now - t < RATE_WINDOW)
    if (live.length === 0) return
    const id = window.setTimeout(() => setNow(Date.now()), Math.min(...live) + RATE_WINDOW - now)
    return () => window.clearTimeout(id)
  }, [sent, now])

  useEffect(() => setQuery("chat", activeChatId), [activeChatId])

  // Scroll only the letters column (never the window), instantly to avoid jank.
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, loading])

  const focusInput = () => setTimeout(() => inputRef.current?.focus(), 0)

  const selectSession = async (s: Session) => {
    if (loading) return
    const request = ++openRequest.current
    setActiveChatId(s.id)
    setError(null)
    setSheetOpen(false)
    if (s.messages) {
      setOpening(false)
      setMessages(s.messages)
      focusInput()
      return
    }

    setMessages([])
    setOpening(true)
    const chat = await getAIChatById(s.id).catch(() => null)
    if (request !== openRequest.current) return
    setOpening(false)
    if (!chat?.messages) {
      setError({ message: "That conversation did not open. Try again." })
      return
    }
    const thread = chat.messages
    setMessages(thread)
    setSessions((prev) => prev.map((x) => (x.id === s.id ? { ...x, messages: thread } : x)))
    focusInput()
  }

  const newChat = () => {
    if (loading) return
    openRequest.current++
    setOpening(false)
    setActiveChatId(undefined)
    setMessages([])
    setInput("")
    setError(null)
    setSheetOpen(false)
    focusInput()
  }

  const closePending = () => setPending((p) => p && { ...p, open: false })

  const rename = async (s: Session, raw: FormDataEntryValue | null) => {
    const name = String(raw ?? "").trim()
    closePending()
    if (!name || name === s.title) return
    try {
      await renameAIChat(s.id, name)
      setSessions((prev) => prev.map((x) => (x.id === s.id ? { ...x, title: name } : x)))
      toast.success("Chat renamed")
    } catch {
      toast.error("Could not rename the chat. Try again.")
    }
  }

  const remove = async (s: Session) => {
    try {
      await deleteAIChat(s.id)
      setSessions((prev) => prev.filter((x) => x.id !== s.id))
      if (activeChatId === s.id) newChat()
      toast.success("Chat deleted")
    } catch {
      toast.error("Could not delete the chat. Try again.")
    }
  }

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    const text = input.trim()
    if (!text || loading || opening || remaining <= 0) return

    const sentAt = Date.now()
    const userMsg: Message = { id: `u-${sentAt}`, msg: text, role: "user" }
    const aiId = `m-${sentAt}`
    const history = messages
    const controller = new AbortController()
    stream.current = controller
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setNow(sentAt)
    setSent((prev) => [...prev.filter((t) => sentAt - t < RATE_WINDOW), sentAt])
    setLoading(true)
    setError(null)

    let full = ""
    let reader: ReadableStreamDefaultReader<Uint8Array> | null = null
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, chatId: activeChatId }),
        signal: controller.signal,
      })

      const ct = res.headers.get("content-type") ?? ""
      if (!res.ok || ct.includes("application/json")) {
        const json = await res.json().catch(() => null)
        const status: number = res.ok ? json?.status ?? res.status : res.status
        throw Object.assign(new Error(json?.message || `AI request failed (${status})`), { status })
      }

      // Empty reply that fills in as chunks stream in.
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
      track("ai-chat-send", { status: "ok" })

      const aiMsg: Message = { id: aiId, msg: finalText, role: "model" }
      const chatId = chatIdMatch?.[1] ?? activeChatId
      if (chatId) {
        const thread = [...history, userMsg, aiMsg]
        setActiveChatId(chatId)
        setSessions((prev) =>
          prev.some((s) => s.id === chatId)
            ? prev.map((s) => (s.id === chatId ? { ...s, messages: thread, messageCount: thread.length } : s))
            : [{ id: chatId, title: text.slice(0, 60), createdAt: new Date().toISOString(), messages: thread, messageCount: thread.length }, ...prev],
        )
      }
    } catch (err) {
      // Leaving the page aborts the reply; nothing is left to show it to.
      if (controller.signal.aborted) return
      // Remove the optimistic messages so the user can retry cleanly, and give back the rate-limit slot.
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id && m.id !== aiId))
      setInput(text)
      setSent((prev) => prev.filter((t) => t !== sentAt))
      const status = (err as { status?: number }).status ?? 0
      track("ai-error", { feature: "chat", status })
      track("ai-chat-send", { status: sendStatus(status) })
      if (status === 401) {
        setError({ message: "Your session has ended. Sign in again.", signIn: true })
      } else if (status === 404 && activeChatId) {
        setSessions((prev) => prev.filter((s) => s.id !== activeChatId))
        setActiveChatId(undefined)
        setMessages([])
        setError({ message: "This chat no longer exists. Send again to start a new chat." })
      } else if (status === 429) {
        setError({ message: "Etan has answered as many messages as it can for now. Try again a little later." })
      } else {
        setError({ message: "Etan could not answer just now. Try again in a minute." })
      }
    } finally {
      reader?.cancel().catch(() => {})
      setLoading(false)
    }
  }

  const activeTitle = sessions.find((s) => s.id === activeChatId)?.title
  const limitNote =
    reopensAt !== null
      ? `Ten messages a minute is the limit. You can send again at ${new Date(reopensAt).toLocaleTimeString("en-GB")}.`
      : remaining < RATE_LIMIT
        ? `${remaining} of ${RATE_LIMIT} messages left this minute.`
        : null
  const blocked = loading || opening || remaining <= 0
  const list = (
    <SessionList
      sessions={sessions}
      activeId={activeChatId}
      busy={loading}
      onSelect={(s) => void selectSession(s)}
      onPending={(p) => setPending({ ...p, open: true })}
    />
  )

  return (
    <div
      data-private
      className="grid h-[calc(100dvh-16rem)] min-h-[24rem] grid-rows-[minmax(0,1fr)] border border-rule md:h-[calc(100dvh-14rem)] md:min-h-[30rem] md:grid-cols-[16rem_minmax(0,1fr)]"
    >
      <aside aria-label="Conversations" className="hidden min-h-0 flex-col border-r border-rule md:flex">
        <div className="flex items-center justify-between gap-2 border-b border-rule p-3">
          <h2 className="font-display text-h4 text-ink">Conversations</h2>
          <Button size="sm" variant="outline" onClick={newChat} disabled={loading}>
            New chat
          </Button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{list}</div>
      </aside>

      <section aria-label="Conversation" className="flex min-h-0 min-w-0 flex-col">
        <div className="flex items-center gap-2 border-b border-rule p-3">
          <h2 className="min-w-0 flex-1 truncate font-display text-h4 text-ink">{activeTitle || "New conversation"}</h2>
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button size="sm" variant="outline" className="md:hidden">
                Conversations
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col gap-4 overflow-y-auto px-0" onCloseAutoFocus={(e) => e.preventDefault()}>
              <div className="px-6">
                <SheetTitle>Conversations</SheetTitle>
                <SheetDescription className="sr-only">Open, rename or delete a saved conversation.</SheetDescription>
                <Button className="mt-4" onClick={newChat} disabled={loading}>
                  New chat
                </Button>
              </div>
              {list}
            </SheetContent>
          </Sheet>
        </div>

        <div ref={scrollRef} aria-busy={loading || opening} className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-[66ch] space-y-6">
            {opening ? (
              <p role="status" className="font-display text-caption text-ink-soft">
                Opening the conversation…
              </p>
            ) : messages.length === 0 && !loading ? (
              <div>
                <h3 className="font-display text-h3 text-ink">Ask Etan anything</h3>
                <p className="mt-2 max-w-[52ch] text-body text-ink-soft">
                  Questions about Rizky&apos;s projects, skills or background are answered from his own records. Each
                  conversation is saved to your account.
                </p>
              </div>
            ) : (
              messages.map((m) => <Letter key={m.id} m={m} />)
            )}
            {loading && messages[messages.length - 1]?.role !== "model" && (
              <p className="border-l border-ink pl-4 font-display text-caption text-ink-soft">Etan is writing…</p>
            )}
          </div>
        </div>

        {error && (
          <ErrorNote className="border-t border-rule px-4 py-3">
            {error.message}
            {error.signIn && (
              <>
                {" "}
                <InkLink href="/auth?redirect=/ai">Sign in</InkLink>
              </>
            )}
          </ErrorNote>
        )}

        <form onSubmit={send} className="border-t border-rule p-3 sm:p-4">
          <Label htmlFor="ai-message">Your message</Label>
          <Input
            id="ai-message"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about a project, a skill or a role"
            disabled={blocked}
            autoComplete="off"
            aria-describedby={limitNote ? "ai-limit" : undefined}
          />
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <MicButton onTranscript={(t) => setInput((p) => (p ? `${p} ${t}` : t))} disabled={blocked} />
            {tts.supported && (
              <TtsToggle
                on={ttsOn}
                onToggle={() => {
                  const next = !ttsOn
                  setTtsOn(next)
                  if (!next) tts.cancel()
                }}
              />
            )}
            {limitNote && (
              <p id="ai-limit" className="font-display text-caption tabular-nums text-ink-soft">
                {limitNote}
              </p>
            )}
            <Button type="submit" className="ml-auto" disabled={blocked || !input.trim()}>
              Send
            </Button>
          </div>
        </form>
      </section>

      <Dialog open={pending?.kind === "rename" && pending.open} onOpenChange={(open) => !open && closePending()}>
        <DialogContent>
          {pending?.kind === "rename" && (
            <form
              className="grid gap-4"
              onSubmit={(e) => {
                e.preventDefault()
                rename(pending.session, new FormData(e.currentTarget).get("title"))
              }}
            >
              <DialogTitle>Rename chat</DialogTitle>
              <DialogDescription className="sr-only">Give this conversation a new name.</DialogDescription>
              <div>
                <Label htmlFor="ai-chat-title">Name</Label>
                <Input id="ai-chat-title" name="title" defaultValue={pending.session.title} maxLength={80} autoFocus />
              </div>
              <DialogFooter>
                <Button type="submit">Save name</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={pending?.kind === "delete" && pending.open} onOpenChange={(open) => !open && closePending()}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete this chat?</AlertDialogTitle>
          <AlertDialogDescription>
            &ldquo;{pending?.session.title || "Untitled conversation"}&rdquo; and its messages will be removed. This cannot be undone.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={() => pending && remove(pending.session)}>
                Delete chat
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
