"use client"

import { useState, useCallback, useRef, useTransition } from "react"
import { Send, User, MessageCircle, RefreshCw, Reply, MoreHorizontal, Edit2, Trash2, X, LogIn } from "lucide-react"
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

async function fetchMessages(): Promise<{ data?: PublicChatMessage[]; error?: string }> {
  try {
    const res = await fetch("/api/chat")
    const result = await res.json()
    if (!res.ok) return { error: result.error || "Failed to fetch messages" }
    return { data: result.data }
  } catch {
    return { error: "Failed to fetch messages" }
  }
}

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
    <div className={`${depth > 0 ? "ml-6 md:ml-10 border-l-2 border-muted pl-4" : ""}`}>
      <div className="flex gap-3 py-3">
        <Avatar className="w-8 h-8 flex-shrink-0">
          {message.user?.avatarUrl && <AvatarImage src={message.user.avatarUrl} alt={message.user.name} />}
          <AvatarFallback className="bg-primary/10 text-primary text-xs">{message.user?.name?.charAt(0).toUpperCase() || <User size={14} />}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">{message.user?.name || "Anonymous"}</span>
            <span className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}</span>
            {message.updatedAt !== message.createdAt && (
              <Badge variant="outline" className="text-xs py-0 h-5">
                edited
              </Badge>
            )}
          </div>

          <p className="text-sm mt-1 whitespace-pre-wrap break-words">{message.message}</p>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {depth === 0 && currentUserId && (
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground" onClick={() => onReply(message)}>
                <Reply size={12} />
                Reply
              </Button>
            )}

            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <MoreHorizontal size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={() => onEdit(message)}>
                    <Edit2 size={14} className="mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(message.id)} className="text-destructive focus:text-destructive">
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

  const refreshMessages = useCallback(() => {
    setLoading(true)
    globalThis.window.location.reload()
    setTimeout(() => setLoading(false), 500)
  }, [router])

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
          globalThis.window.location.reload()
        } else {
          toast.error(result.error || "Failed to update message")
        }
      } else {
        const result = await createMessage(inputMessage, replyTo?.id)
        if (result.data) {
          toast.success("Message sent")
          setReplyTo(null)
          setInputMessage("")
          globalThis.window.location.reload()
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
        globalThis.window.location.reload()
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
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 mb-4">
          <CardContent className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <LogIn className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1">Join the conversation</h3>
                  <p className="text-sm text-muted-foreground">Login to post messages, reply to others, and participate in discussions</p>
                </div>
              </div>
              <Link href="/auth">
                <Button className="gap-2 whitespace-nowrap">
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Container */}
      <Card className="flex flex-col">
        <CardHeader className="pb-3 border-b flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Messages
            <Badge variant="secondary" className="ml-2">
              {messages.length}
            </Badge>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={refreshMessages} disabled={loading} className="gap-2">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>
        </CardHeader>

        {/* Messages Area */}
        <CardContent className="flex-1 overflow-y-auto p-4 max-h-[50vh] min-h-[300px]">
          {loading && messages.length === 0 ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="w-8 h-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <MessageCircle className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No messages yet</h3>
              <p className="text-sm text-muted-foreground">Be the first to start a conversation!</p>
            </div>
          ) : (
            <div className="divide-y">
              {messages.map((message) => (
                <MessageItem key={message.id} message={message} currentUserId={currentUser?.id || null} onReply={handleReply} onEdit={handleEdit} onDelete={handleDelete} onRefresh={refreshMessages} />
              ))}
            </div>
          )}
        </CardContent>

        {/* Reply/Edit Indicator */}
        {(replyTo || editingMessage) && (
          <div className="px-4 py-2 bg-muted/50 border-t flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              {editingMessage ? (
                <>
                  <Edit2 size={14} className="text-primary" />
                  <span className="text-muted-foreground">Editing message</span>
                </>
              ) : (
                <>
                  <Reply size={14} className="text-primary" />
                  <span className="text-muted-foreground">
                    Replying to <strong>{replyTo?.user?.name || "Anonymous"}</strong>
                  </span>
                </>
              )}
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={cancelReplyOrEdit}>
              <X size={14} />
            </Button>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2 items-stretch">
            <Textarea
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={!currentUser ? "Login to send messages..." : editingMessage ? "Edit your message..." : replyTo ? `Reply to ${replyTo.user?.name || "Anonymous"}...` : "Type your message..."}
              disabled={sending || !currentUser}
              className="flex-1"
            />
            <Button type="submit" disabled={!inputMessage.trim() || sending || !currentUser} className="h-auto px-4">
              {sending ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-2">Press Enter to send, Shift+Enter for new line</p>
        </div>
      </Card>
    </>
  )
}
