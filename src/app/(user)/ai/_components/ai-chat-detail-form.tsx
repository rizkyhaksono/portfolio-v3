"use client"

import { useState } from "react"
import { toast } from "sonner"
import { requestAIChat } from "@/services/user/ai"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import MDXComponent from "@/components/ui/mdx-components"
import { Send, Loader2, Bot, User } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

type Message = {
  id: string
  msg: string
  role: string
  createdAt: string
}

export default function AIChatDetailForm({
  chatId,
  initialMessages,
}: {
  chatId: string
  initialMessages: Message[]
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || loading) return

    const userText = inputValue.trim()
    setInputValue("")
    setMessages((prev) => [
      ...prev,
      {
        id: `temp-user-${Date.now()}`,
        msg: userText,
        role: "user",
        createdAt: new Date().toISOString(),
      },
    ])
    setLoading(true)

    try {
      const res = await requestAIChat(userText, chatId)
      setMessages((prev) => [
        ...prev,
        {
          id: `temp-model-${Date.now()}`,
          msg: res.data,
          role: "model",
          createdAt: new Date().toISOString(),
        },
      ])
      toast.success("Response received")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to get response")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          {messages.map((m) => (
            <div key={m.id} className="flex items-start gap-3">
              <Avatar className="h-8 w-8 border">
                <AvatarFallback>
                  {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-violet-500" />}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-1">{m.role === "user" ? "You" : "Etan AI"}</p>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <MDXComponent>{m.msg}</MDXComponent>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <p className="text-sm text-muted-foreground animate-pulse">Etan is thinking...</p>
          )}
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Continue the conversation..."
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !inputValue.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  )
}
