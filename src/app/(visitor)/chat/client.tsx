"use client"

import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { track } from "@/lib/analytics"
import { cn } from "@/lib/utils"
import { StatusLine } from "@/components/ui/status-line"
import { PublicChatMessage } from "@/commons/types/public-chat"

const JSON_HEADERS = { "Content-Type": "application/json" }
// Fixed zone so the server and the browser print the same dateline.
const STAMP = new Intl.DateTimeFormat("en-GB", { dateStyle: "long", timeStyle: "short", timeZone: "Asia/Jakarta" })

async function chatRequest(
  url: string,
  init: RequestInit,
  fallback: string,
): Promise<{ result?: { data?: PublicChatMessage; error?: string }; error?: string }> {
  try {
    const res = await fetch(url, init)
    const result = (await res.json()) as { data?: PublicChatMessage; error?: string }
    if (!res.ok) return { error: result.error || fallback }
    return { result }
  } catch {
    return { error: fallback }
  }
}

async function createMessage(message: string, replyToId?: string): Promise<{ data?: PublicChatMessage; error?: string }> {
  const { result, error } = await chatRequest(
    "/api/chat",
    { method: "POST", headers: JSON_HEADERS, body: JSON.stringify({ message, replyToId }) },
    "The message did not send. Try again.",
  )
  return error ? { error } : { data: result?.data }
}

async function updateMessage(messageId: string, message: string): Promise<{ data?: PublicChatMessage; error?: string }> {
  const { result, error } = await chatRequest(
    `/api/chat/${messageId}`,
    { method: "PATCH", headers: JSON_HEADERS, body: JSON.stringify({ message }) },
    "The change was not saved. Try again.",
  )
  return error ? { error } : { data: result?.data }
}

async function deleteMessage(messageId: string): Promise<{ success?: boolean; error?: string }> {
  const { error } = await chatRequest(`/api/chat/${messageId}`, { method: "DELETE" }, "The message was not deleted. Try again.")
  return error ? { error } : { success: true }
}

interface ChatClientProps {
  initialMessages: PublicChatMessage[]
  currentUser: { id: string; name: string } | null
}

const nameOf = (message: PublicChatMessage) => message.user?.name || "Anonymous"

interface LetterProps {
  message: PublicChatMessage
  quoted: PublicChatMessage | null
  canReply: boolean
  canManage: boolean
  onReply: (m: PublicChatMessage) => void
  onEdit: (m: PublicChatMessage) => void
  onDelete: (m: PublicChatMessage) => void
}

/** One letter: the writer, the text, a dateline sentence. Replies sit behind a left rule. */
function Letter({ message, quoted, canReply, canManage, onReply, onEdit, onDelete }: Readonly<LetterProps>) {
  const name = nameOf(message)
  const date = new Date(message.createdAt)
  const edited = message.updatedAt !== message.createdAt

  return (
    <article className={cn(quoted && "ml-3 border-l border-ink pl-4 sm:ml-8")}>
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarImage src={message.user?.avatarUrl ?? message.user?.iconUrl ?? undefined} alt="" referrerPolicy="no-referrer" />
          <AvatarFallback className="text-xs">{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-wrap items-center gap-x-2 text-body">
          <span className="font-semibold text-ink">{name}</span>
          {message.user?.role === "ADMIN" && <Badge variant="outline">Site owner</Badge>}
        </div>
      </div>

      {quoted && (
        <p className="mt-2 truncate font-display text-caption text-ink-soft">
          In reply to {nameOf(quoted)}: &ldquo;{quoted.message}&rdquo;
        </p>
      )}
      <p className="mt-2 max-w-[66ch] whitespace-pre-wrap break-words text-body text-ink">{message.message}</p>

      <div className="mt-1 flex flex-wrap items-center gap-x-5">
        {!Number.isNaN(date.getTime()) && (
          <time dateTime={message.createdAt} suppressHydrationWarning className="font-display text-caption text-ink-soft">
            {STAMP.format(date)}
            {edited && ", edited"}
          </time>
        )}
        {canReply && (
          <Button variant="ghost" size="sm" className="px-0" aria-label={`Reply to ${name}`} onClick={() => onReply(message)}>
            Reply
          </Button>
        )}
        {canManage && (
          <>
            <Button variant="ghost" size="sm" className="px-0" aria-label="Edit your message" onClick={() => onEdit(message)}>
              Edit
            </Button>
            <Button variant="ghost" size="sm" className="px-0" aria-label="Delete your message" onClick={() => onDelete(message)}>
              Delete
            </Button>
          </>
        )}
      </div>
    </article>
  )
}

export default function ChatClient({ initialMessages, currentUser }: Readonly<ChatClientProps>) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [inputMessage, setInputMessage] = useState("")
  const [replyTo, setReplyTo] = useState<PublicChatMessage | null>(null)
  const [editingMessage, setEditingMessage] = useState<PublicChatMessage | null>(null)
  const [pendingDelete, setPendingDelete] = useState<PublicChatMessage | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const newestRef = useRef<HTMLLIElement>(null)

  // Derive directly from the prop (not state) so router.refresh() — which refetches
  // the force-dynamic page after send/edit/delete — surfaces the updated messages.
  // Flatten top-level messages + their replies into one chronological stream, dedup
  // by id (a reply may also appear top-level; also guards against cycles), and index
  // every message so replies can quote their parent.
  const { stream, byId } = useMemo(() => {
    const byId = new Map<string, PublicChatMessage>()
    const flat: PublicChatMessage[] = []
    const seen = new Set<string>()
    const walk = (list: PublicChatMessage[]) => {
      for (const m of list) {
        if (seen.has(m.id)) continue
        seen.add(m.id)
        byId.set(m.id, m)
        flat.push(m)
        if (m.replies?.length) walk(m.replies)
      }
    }
    walk(initialMessages)
    const ts = (v: string) => {
      const t = new Date(v).getTime()
      return Number.isNaN(t) ? 0 : t
    }
    flat.sort((a, b) => ts(a.createdAt) - ts(b.createdAt))
    return { stream: flat, byId }
  }, [initialMessages])

  // Only the letters column scrolls: open at the newest message and follow new ones as they arrive.
  const listRef = useRef<HTMLDivElement>(null)
  const shown = useRef(0)
  useEffect(() => {
    const list = listRef.current
    if (list && stream.length !== shown.current) list.scrollTop = list.scrollHeight
    shown.current = stream.length
  }, [stream.length])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim() || !currentUser) return

    startTransition(async () => {
      if (editingMessage) {
        const result = await updateMessage(editingMessage.id, inputMessage)
        if (!result.data) {
          toast.error(result.error || "Something went wrong. Try again.")
          return
        }
        toast.success("Message updated.")
        setEditingMessage(null)
      } else {
        const result = await createMessage(inputMessage, replyTo?.id)
        if (!result.data) {
          toast.error(result.error || "Something went wrong. Try again.")
          return
        }
        track("chat-send", { reply: replyTo ? "yes" : "no" })
        setReplyTo(null)
      }
      setInputMessage("")
      router.refresh()
    })
  }

  const handleReply = (message: PublicChatMessage) => {
    setReplyTo(message)
    setEditingMessage(null)
    textareaRef.current?.focus()
  }

  const handleEdit = (message: PublicChatMessage) => {
    setEditingMessage(message)
    setInputMessage(message.message)
    setReplyTo(null)
    textareaRef.current?.focus()
  }

  const confirmDelete = () => {
    const message = pendingDelete
    setPendingDelete(null)
    if (!message) return
    startTransition(async () => {
      const result = await deleteMessage(message.id)
      if (!result.success) {
        toast.error(result.error || "Something went wrong. Try again.")
        return
      }
      toast.success("Message deleted.")
      router.refresh()
    })
  }

  const cancelReplyOrEdit = () => {
    setReplyTo(null)
    setEditingMessage(null)
    setInputMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Phone keyboards have no Shift: there Enter is a new line and Send posts.
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && !window.matchMedia("(pointer: coarse)").matches) {
      e.preventDefault()
      e.currentTarget.form?.requestSubmit()
    }
  }

  const composerLabel = editingMessage
    ? "Edit your message"
    : replyTo
      ? `Reply to ${nameOf(replyTo)}`
      : "Write a message"

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-6 py-2">
        <p className="font-display text-caption tabular-nums text-ink-soft">
          {stream.length === 1 ? "1 message" : `${stream.length} messages`}
        </p>
        <Button variant="ghost" size="sm" className="ml-auto px-0" disabled={isPending} onClick={() => startTransition(() => router.refresh())}>
          {isPending ? "Updating…" : "Refresh"}
        </Button>
      </div>

      <div ref={listRef} tabIndex={0} aria-label="Messages" className="min-h-0 flex-1 overflow-y-auto overscroll-contain border-t border-rule">
      {stream.length === 0 ? (
        <StatusLine kind="empty" className="py-10">
          No messages yet. Yours could be the first.
        </StatusLine>
      ) : (
        <ol role="list" className="divide-y divide-rule">
          {stream.map((m, index) => {
            const isMine = currentUser?.id === m.userId
            const newest = index === stream.length - 1
            return (
              <li key={m.id} id={newest ? "chat-newest" : undefined} ref={newest ? newestRef : undefined} className="py-5">
                <Letter
                  message={m}
                  quoted={m.replyToId ? byId.get(m.replyToId) ?? null : null}
                  canReply={Boolean(currentUser) && !isMine}
                  canManage={isMine}
                  onReply={handleReply}
                  onEdit={handleEdit}
                  onDelete={setPendingDelete}
                />
              </li>
            )
          })}
        </ol>
      )}
      </div>

      {currentUser ? (
        <form onSubmit={handleSendMessage} className="shrink-0 border-t border-ink pb-4 pt-3">
          <div className="flex items-baseline justify-between gap-4">
            <Label htmlFor="chat-message" className="truncate">
              {composerLabel}
            </Label>
            {(replyTo || editingMessage) && (
              <Button type="button" variant="ghost" size="sm" className="px-0" onClick={cancelReplyOrEdit}>
                Cancel
              </Button>
            )}
          </div>
          <div className="mt-1 flex items-end gap-3">
            <Textarea
              id="chat-message"
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isPending}
              rows={2}
              aria-describedby="chat-hint"
              className="max-h-40 min-h-11 flex-1 resize-none"
            />
            <Button type="submit" disabled={!inputMessage.trim() || isPending}>
              {isPending ? "Sending…" : editingMessage ? "Save" : "Send"}
            </Button>
          </div>
          <p id="chat-hint" className="mt-1 font-display text-caption text-ink-soft">
            <span className="[@media(pointer:coarse)]:hidden">Enter sends. Shift and Enter start a new line.</span>
            <span className="hidden [@media(pointer:coarse)]:inline">Enter starts a new line. Send posts the message.</span>
          </p>
        </form>
      ) : (
        <div className="shrink-0 border-t border-ink py-3">
          <Button asChild size="sm">
            <Link href="/auth?redirect=/chat">Sign in to write a message</Link>
          </Button>
        </div>
      )}

      <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete your message?</AlertDialogTitle>
            <AlertDialogDescription>It disappears for everyone. This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete message
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
