"use client"

import { useEffect, useState, useCallback } from "react"
import { getAIChat } from "@/services/user/ai"
import MDXComponent from "@/components/ui/mdx-components"
import { MessageCircle, Bot, User } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

export default function AIChat() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchAIChat = useCallback(async () => {
    try {
      setLoading(true)
      const res = await getAIChat()
      setData(res)
    } catch (error) {
      console.error("Failed to fetch AI chat:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAIChat()
  }, [fetchAIChat])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-10 px-6">
          <div className="p-3 rounded-full bg-muted mb-3">
            <MessageCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground text-center">No chat history yet. Start a conversation above!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {data.data.map((item: any, index: number) => (
        <Card key={item.id || `chat-${index}`} className="overflow-hidden hover:shadow-md transition-shadow">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value={`item-${index}`} className="border-b-0">
              <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-accent/50 group">
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 rounded-full bg-gradient-to-br from-violet-500/10 to-purple-500/10 group-hover:from-violet-500/20 group-hover:to-purple-500/20 transition-colors">
                    <MessageCircle className="h-4 w-4 text-violet-500" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="font-medium truncate pr-4">{item.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge variant="secondary" className="text-xs font-normal">
                        {item.messages?.length || 0} messages
                      </Badge>
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <CardContent className="pt-0 pb-4">
                  <div className="space-y-4 pl-2 border-l-2 border-muted ml-5">
                    {item.messages?.map((message: any, msgIndex: number) => (
                      <div key={message.id || `msg-${msgIndex}`} className="pl-4 space-y-4">
                        {/* User Message */}
                        <div className="flex items-start gap-3">
                          <Avatar className="h-7 w-7 border">
                            <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=You" />
                            <AvatarFallback>
                              <User className="h-3.5 w-3.5" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-muted-foreground mb-1">You</p>
                            <p className="text-sm">{item.title}</p>
                          </div>
                        </div>

                        {/* AI Response */}
                        <div className="flex items-start gap-3">
                          <Avatar className="h-7 w-7 border bg-gradient-to-br from-violet-500/20 to-purple-500/20">
                            <AvatarFallback>
                              <Bot className="h-3.5 w-3.5 text-violet-500" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-muted-foreground mb-1">Etan AI</p>
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              <MDXComponent>{message.msg}</MDXComponent>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      ))}
    </div>
  )
}
