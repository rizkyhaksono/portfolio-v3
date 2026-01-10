"use client"

import { useState, useCallback, useRef, useTransition, useEffect } from "react"
import { Send, User, MessageCircle, RefreshCw, Reply, MoreHorizontal, Edit2, Trash2, X, LogIn, BadgeCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { toast } from "sonner"
import { PublicChatMessage } from "@/commons/types/public-chat"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"

async function createMessage(message: string, replyToId?: string): Promise<{ data?: PublicChatMessage; error?: string }> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, replyToId }),
    })
    const result = await res.json()
    if (!res.ok) return { error: result.error || "Failed to send message" }
    return { data: result.data }
  } catch {
    return { error: "Failed to send message" }
  }
}

async function updateMessage(messageId: string, message: string): Promise<{ data?: PublicChatMessage; error?: string }> {
  try {
    const res = await fetch(`/api/chat/${messageId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    })
    const result = await res.json()
    if (!res.ok) return { error: result.error || "Failed to update message" }
    return { data: result.data }
  } catch {
    return { error: "Failed to update message" }
  }
}

async function deleteMessage(messageId: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/chat/${messageId}`, { method: "DELETE" })
    const result = await res.json()
    if (!res.ok) return { error: result.error || "Failed to delete message" }
    return { success: true }
  } catch {
    return { error: "Failed to delete message" }
  }
}

interface ChatClientProps {
  initialMessages: PublicChatMessage[]
  currentUser: { id: string; name: string } | null
}

interface MessageItemProps {
  message: PublicChatMessage
  currentUserId: string | null
  onReply: (message: PublicChatMessage) => void
  onEdit: (message: PublicChatMessage) => void
  onDelete: (messageId: string) => void
  onRefresh: () => void
  depth?: number
}

function MessageItem({ message, currentUserId, onReply, onEdit, onDelete, onRefresh, depth = 0 }: Readonly<MessageItemProps>) {
  const replies = message.replies || []
  const isOwner = currentUserId && message.userId === currentUserId
  const maxDepth = 2

  return (
    <div className={`group ${depth > 0 ? "ml-4 md:ml-8 border-l-2 border-border/50 pl-4 mt-2" : ""}`}>
      <div className="flex gap-3 py-3 hover:bg-muted/30 -mx-2 px-2 rounded-lg transition-colors">
        <Avatar className="w-9 h-9 flex-shrink-0 ring-2 ring-background">
          {message.user?.iconUrl && <Image src={message.user.iconUrl} alt={message.user.name} width={60} height={60} />}
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold text-sm">{message.user?.name?.charAt(0).toUpperCase() || <User size={16} />}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="font-semibold text-sm text-foreground">{message.user?.name || "Anonymous"}</span>
            {message.user?.role === "ADMIN" && <BadgeCheck size={12} />}
            <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}</span>
            {message.updatedAt !== message.createdAt && (
              <Badge variant="secondary" className="text-xs py-0 h-5 font-normal">
                edited
              </Badge>
            )}
          </div>

          <div className="bg-muted/40 rounded-lg px-3 py-2 inline-block max-w-full">
            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.message}</p>
          </div>

          <div className="flex items-center gap-1 mt-2">
            {depth === 0 && currentUserId && (
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10" onClick={() => onReply(message)}>
                <Reply size={13} />
                Reply
              </Button>
            )}

            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-muted">
                    <MoreHorizontal size={15} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  <DropdownMenuItem onClick={() => onEdit(message)} className="cursor-pointer">
                    <Edit2 size={14} className="mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(message.id)} className="cursor-pointer text-destructive focus:text-destructive">
                    <Trash2 size={14} className="mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>

      {/* Auto-loaded Replies */}
      {replies.length > 0 && depth < maxDepth && (
        <div className="space-y-0">
          {replies.map((reply) => (
            <MessageItem key={reply.id} message={reply} currentUserId={currentUserId} onReply={onReply} onEdit={onEdit} onDelete={onDelete} onRefresh={onRefresh} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function ChatClient({ initialMessages, currentUser }: Readonly<ChatClientProps>) {
  const router = useRouter()
  const [messages, setMessages] = useState<PublicChatMessage[]>(initialMessages)
  const [loading, setLoading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [inputMessage, setInputMessage] = useState("")
  const [replyTo, setReplyTo] = useState<PublicChatMessage | null>(null)
  const [editingMessage, setEditingMessage] = useState<PublicChatMessage | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const refreshMessages = useCallback(() => {
    setLoading(true)
    startTransition(() => {
      router.refresh()
      setTimeout(() => setLoading(false), 500)
    })
  }, [router])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  // Auto-scroll to latest message on mount
  useEffect(() => {
    setTimeout(scrollToBottom, 100)
  }, [])

  // Auto-scroll when messages change
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(scrollToBottom, 100)
    }
  }, [messages, scrollToBottom])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    if (!currentUser) {
      toast.error("Please login to send messages")
      return
    }

    startTransition(async () => {
      if (editingMessage) {
        const result = await updateMessage(editingMessage.id, inputMessage)
        if (result.data) {
          toast.success("Message updated")
          setEditingMessage(null)
          setInputMessage("")
          window.location.reload()
        } else {
          toast.error(result.error || "Failed to update message")
        }
      } else {
        const result = await createMessage(inputMessage, replyTo?.id)
        if (result.data) {
          toast.success("Message sent")
          setReplyTo(null)
          setInputMessage("")
          window.location.reload()
        } else {
          toast.error(result.error || "Failed to send message")
        }
      }
    })
  }

  const handleReply = (message: PublicChatMessage) => {
    if (!currentUser) {
      toast.error("Please login to reply")
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

  const handleDelete = async (messageId: string) => {
    if (!currentUser) return

    startTransition(async () => {
      const result = await deleteMessage(messageId)
      if (result.success) {
        toast.success("Message deleted")
        window.location.reload()
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

  const sending = isPending

  return (
    <>
      {/* Login Notice */}
      {!currentUser && (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent mb-6 shadow-sm">
          <CardContent className="p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="p-2.5 rounded-full bg-primary/15 ring-2 ring-primary/20">
                  <LogIn className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1">Join the conversation</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">Login to post messages, reply to others, and participate in discussions</p>
                </div>
              </div>
              <Link href="/auth" className="w-full sm:w-auto">
                <Button className="gap-2 w-full sm:w-auto shadow-sm hover:shadow-md transition-shadow">
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Container */}
      <Card className="flex flex-col shadow-lg border-border/50">
        <CardHeader className="pb-4 pt-5 border-b bg-muted/20 flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <MessageCircle className="w-5 h-5 text-primary" />
            </div>
            <span>Messages</span>
            <Badge variant="secondary" className="ml-1 font-semibold">
              {messages.length}
            </Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={refreshMessages} disabled={loading} className="gap-2 hover:bg-muted">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </CardHeader>

        {/* Messages Area */}
        <CardContent className="flex-1 overflow-y-auto p-4 max-h-[55vh] min-h-[320px] bg-gradient-to-b from-background to-muted/10">
          {loading && messages.length === 0 ? (
            <div className="space-y-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <Skeleton className="w-9 h-9 rounded-full" />
                  <div className="flex-1 space-y-2.5">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-16 w-full rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div className="p-4 rounded-full bg-muted/50 mb-4">
                <MessageCircle className="w-12 h-12 text-muted-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">No messages yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">Be the first to start a conversation! Share your thoughts and connect with others.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {messages.map((message) => (
                <MessageItem key={message.id} message={message} currentUserId={currentUser?.id || null} onReply={handleReply} onEdit={handleEdit} onDelete={handleDelete} onRefresh={refreshMessages} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </CardContent>

        {/* Reply/Edit Indicator */}
        {(replyTo || editingMessage) && (
          <div className="px-4 py-3 bg-primary/5 border-t border-primary/20 flex items-center justify-between animate-in slide-in-from-top-2">
            <div className="flex items-center gap-2.5 text-sm">
              <div className="p-1.5 rounded-md bg-primary/10">{editingMessage ? <Edit2 size={14} className="text-primary" /> : <Reply size={14} className="text-primary" />}</div>
              <div>
                {editingMessage ? (
                  <span className="font-medium">Editing message</span>
                ) : (
                  <span>
                    Replying to <strong className="font-semibold text-foreground">{replyTo?.user?.name || "Anonymous"}</strong>
                  </span>
                )}
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive" onClick={cancelReplyOrEdit}>
              <X size={15} />
            </Button>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t bg-muted/20 p-4">
          <form onSubmit={handleSendMessage} className="flex flex-col gap-2.5">
            <Textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={!currentUser ? "Login to send messages..." : editingMessage ? "Edit your message..." : replyTo ? `Reply to ${replyTo.user?.name || "Anonymous"}...` : "Type your message..."}
              disabled={sending || !currentUser}
              className="w-full max-h-32 resize-none focus-visible:ring-2 focus-visible:ring-primary/50 bg-background"
            />
            <Button type="submit" disabled={!inputMessage.trim() || sending || !currentUser} className="w-full px-4 gap-2 shadow-sm hover:shadow-md transition-all">
              {sending ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send size={16} />
                  <span>{editingMessage ? "Update" : "Send"} Message</span>
                </>
              )}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground/80 mt-2.5 text-center">
            Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">Shift+Enter</kbd> for new line
          </p>
        </div>
      </Card>
    </>
  )
}
