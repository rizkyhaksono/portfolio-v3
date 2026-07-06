"use client"

import { useState, useCallback, useRef, useTransition, useEffect, useMemo } from "react"
import { Send, User, Reply, MoreHorizontal, Edit2, Trash2, X, BadgeCheck, Info, RefreshCw, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Eyebrow } from "@/components/ui/eyebrow"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { PublicChatMessage } from "@/commons/types/public-chat"
import { format } from "date-fns"
import Link from "next/link"
import { useRouter } from "next/navigation"

const WS_LABEL = "wscat -c wss://api.nateee.com/v3/public-chat"

const JSON_HEADERS = { "Content-Type": "application/json" }

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
    "Failed to send message",
  )
  return error ? { error } : { data: result?.data }
}

async function updateMessage(messageId: string, message: string): Promise<{ data?: PublicChatMessage; error?: string }> {
  const { result, error } = await chatRequest(
    `/api/chat/${messageId}`,
    { method: "PATCH", headers: JSON_HEADERS, body: JSON.stringify({ message }) },
    "Failed to update message",
  )
  return error ? { error } : { data: result?.data }
}

async function deleteMessage(messageId: string): Promise<{ success?: boolean; error?: string }> {
  const { error } = await chatRequest(`/api/chat/${messageId}`, { method: "DELETE" }, "Failed to delete message")
  return error ? { error } : { success: true }
}

interface ChatClientProps {
  initialMessages: PublicChatMessage[]
  currentUser: { id: string; name: string } | null
}

function avatarSrc(user: PublicChatMessage["user"]): string | undefined {
  return user?.avatarUrl ?? user?.iconUrl ?? undefined
}

function QuoteBox({ quoted }: { quoted: PublicChatMessage }) {
  return (
    <div className="mb-1.5 rounded-lg border border-border/50 bg-background/50 px-2.5 py-1.5">
      <p className="truncate text-xs font-semibold text-foreground/90">{quoted.user?.name || "Anonymous"}</p>
      <p className="line-clamp-2 text-xs text-muted-foreground">{quoted.message}</p>
    </div>
  )
}

interface BubbleProps {
  message: PublicChatMessage
  quoted: PublicChatMessage | null
  alignRight: boolean
  canReply: boolean
  canManage: boolean
  onReply: (m: PublicChatMessage) => void
  onEdit: (m: PublicChatMessage) => void
  onDelete: (id: string) => void
}

function Bubble({ message, quoted, alignRight, canReply, canManage, onReply, onEdit, onDelete }: Readonly<BubbleProps>) {
  const name = message.user?.name || "Anonymous"
  const isAdmin = message.user?.role === "ADMIN"
  const edited = message.updatedAt !== message.createdAt
  const parsedDate = new Date(message.createdAt)
  const time = Number.isNaN(parsedDate.getTime()) ? "" : format(parsedDate, "dd/MM/yyyy, HH:mm")

  const AvatarEl = (
    <Avatar className="h-8 w-8 shrink-0 ring-2 ring-background">
      <AvatarImage src={avatarSrc(message.user)} alt={name} referrerPolicy="no-referrer" />
      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-xs font-semibold text-primary">
        {name.charAt(0).toUpperCase() || <User size={14} />}
      </AvatarFallback>
    </Avatar>
  )

  const Actions = (
    <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
      {canReply && (
        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => onReply(message)}>
          <Reply size={13} />
        </Button>
      )}
      {canManage && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
              <MoreHorizontal size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem onClick={() => onEdit(message)} className="cursor-pointer">
              <Edit2 size={13} className="mr-2" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(message.id)} className="cursor-pointer text-destructive focus:text-destructive">
              <Trash2 size={13} className="mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )

  return (
    <div className={cn("group flex w-full gap-2.5", alignRight ? "flex-row-reverse" : "flex-row")}>
      {AvatarEl}
      <div className={cn("flex min-w-0 max-w-[78%] flex-col", alignRight ? "items-end" : "items-start")}>
        <div className={cn("mb-1 flex items-center gap-1.5", alignRight ? "flex-row-reverse" : "")}>
          <span className="text-sm font-semibold text-foreground">{name}</span>
          {isAdmin && <BadgeCheck size={14} className="text-primary" />}
        </div>

        <div className={cn("flex items-center gap-1", alignRight ? "flex-row" : "flex-row-reverse")}>
          {Actions}
          <div
            className={cn(
              "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
              alignRight ? "rounded-tr-sm bg-primary/10" : "rounded-tl-sm bg-muted/60",
            )}
          >
            {quoted && <QuoteBox quoted={quoted} />}
            <p className="whitespace-pre-wrap break-words">{message.message}</p>
          </div>
        </div>

        <div className={cn("mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground", alignRight ? "flex-row-reverse" : "")}>
          <span>{time}</span>
          {edited && <span className="opacity-70">· edited</span>}
        </div>
      </div>
    </div>
  )
}

export default function ChatClient({ initialMessages, currentUser }: Readonly<ChatClientProps>) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [inputMessage, setInputMessage] = useState("")
  const [replyTo, setReplyTo] = useState<PublicChatMessage | null>(null)
  const [editingMessage, setEditingMessage] = useState<PublicChatMessage | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Derive directly from the prop (not state) so router.refresh() — which refetches
  // the force-dynamic page after send/edit/delete — surfaces the updated messages.
  // Flatten top-level messages + their replies into one chronological stream, dedup
  // by id (a reply may also appear top-level; also guards against cycles), and index
  // every message so replies can render a quote of their parent.
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

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  // Scroll to the newest message on mount and whenever the stream changes.
  useEffect(() => {
    const id = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(id)
  }, [stream.length, scrollToBottom])

  const refresh = () => {
    setRefreshing(true)
    startTransition(() => {
      router.refresh()
      setTimeout(() => setRefreshing(false), 600)
    })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return
    if (!currentUser) {
      toast.error("Please sign in to send messages")
      return
    }

    startTransition(async () => {
      if (editingMessage) {
        const result = await updateMessage(editingMessage.id, inputMessage)
        if (result.data) {
          toast.success("Message updated")
          setEditingMessage(null)
          setInputMessage("")
          router.refresh()
        } else {
          toast.error(result.error || "Failed to update message")
        }
      } else {
        const result = await createMessage(inputMessage, replyTo?.id)
        if (result.data) {
          toast.success("Message sent")
          setReplyTo(null)
          setInputMessage("")
          router.refresh()
        } else {
          toast.error(result.error || "Failed to send message")
        }
      }
    })
  }

  const handleReply = (message: PublicChatMessage) => {
    if (!currentUser) {
      toast.error("Please sign in to reply")
      return
    }
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

  const handleDelete = (messageId: string) => {
    if (!currentUser) return
    startTransition(async () => {
      const result = await deleteMessage(messageId)
      if (result.success) {
        toast.success("Message deleted")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to delete message")
      }
    })
  }

  const cancelReplyOrEdit = () => {
    setReplyTo(null)
    setEditingMessage(null)
    setInputMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(e as unknown as React.FormEvent)
    }
  }

  return (
    <div className="w-full">
      {/* Terminal window */}
      <div className="overflow-hidden rounded-2xl border border-border/60 bg-background/60 shadow-xl backdrop-blur-sm">
        {/* Title bar */}
        <div className="flex items-center gap-3 border-b border-border/60 bg-muted/40 px-4 py-3">
          <p className="flex-1 truncate font-mono text-xs text-muted-foreground">{WS_LABEL}</p>
          <button onClick={refresh} className="text-muted-foreground transition-colors hover:text-foreground" aria-label="Refresh">
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
          </button>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-400/90" />
            <span className="h-3 w-3 rounded-full bg-yellow-400/90" />
            <span className="h-3 w-3 rounded-full bg-green-400/90" />
          </div>
        </div>

        {/* Pinned message — fixed above the scroll area so it stays visible */}
        <div className="flex shrink-0 items-start gap-2.5 border-b border-border/60 bg-muted/20 px-4 py-3 sm:px-6">
          <Info size={16} className="mt-0.5 shrink-0 text-muted-foreground" />
          <div className="min-w-0">
            <Eyebrow>Pinned</Eyebrow>
            <p className="mt-1 text-sm leading-relaxed">
              <span className="font-medium text-foreground">@Rizky Haksono</span> Hello welcome to my site, enjoy 👋
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex max-h-[58vh] min-h-[360px] flex-col gap-5 overflow-y-auto px-4 py-5 sm:px-6">
          {stream.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
              <p className="font-medium">No messages yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Be the first to start the conversation.</p>
            </div>
          ) : (
            stream.map((m) => {
              const isMine = currentUser?.id === m.userId
              return (
                <Bubble
                  key={m.id}
                  message={m}
                  quoted={m.replyToId ? byId.get(m.replyToId) ?? null : null}
                  alignRight={m.user?.role === "ADMIN"}
                  canReply={Boolean(currentUser) && !isMine}
                  canManage={isMine}
                  onReply={handleReply}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Composer (only when signed in) */}
        {currentUser && (
          <div className="border-t border-border/60 bg-muted/20">
            {(replyTo || editingMessage) && (
              <div className="flex items-center justify-between border-b border-border/40 bg-primary/5 px-4 py-2 text-sm">
                <span className="flex items-center gap-2 text-muted-foreground">
                  {editingMessage ? <Edit2 size={13} /> : <Reply size={13} />}
                  {editingMessage ? "Editing message" : <>Replying to <strong className="font-semibold text-foreground">{replyTo?.user?.name || "Anonymous"}</strong></>}
                </span>
                <Button variant="ghost" size="icon" className="h-6 w-6 hover:text-destructive" onClick={cancelReplyOrEdit}>
                  <X size={14} />
                </Button>
              </div>
            )}
            <form onSubmit={handleSendMessage} className="flex items-end gap-2 p-3">
              <Textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={editingMessage ? "Edit your message…" : replyTo ? `Reply to ${replyTo.user?.name || "Anonymous"}…` : "Type a message…"}
                disabled={isPending}
                rows={1}
                className="max-h-32 min-h-[42px] flex-1 resize-none rounded-xl bg-background focus-visible:ring-2 focus-visible:ring-primary/40"
              />
              <Button type="submit" size="icon" disabled={!inputMessage.trim() || isPending} className="h-[42px] w-[42px] shrink-0 rounded-xl">
                {isPending ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
              </Button>
            </form>
          </div>
        )}
      </div>

      {/* Sign-in pill (only when signed out) */}
      {!currentUser && (
        <div className="mt-6 flex justify-center">
          <Button asChild className="gap-2 rounded-full px-6 shadow-lg">
            <Link href="/auth">
              <LogIn size={16} />
              Sign in to use Realtime Chats
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
