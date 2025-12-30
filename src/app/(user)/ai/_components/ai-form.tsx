"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { isHaveValidToken } from "@/app/actions/actions"
import { requestAIChat } from "@/services/user/ai"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import MDXComponent from "@/components/ui/mdx-components"
import { Skeleton } from "@/components/ui/skeleton"
import AIChat from "./ai-chat"
import { Send, Loader2, Lock, Bot, User, Sparkles, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const RATE_LIMIT = 3 // Max requests
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute in milliseconds

export default function AIForm() {
  const [query, setQuery] = useState("")
  const [data, setData] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [requestTimestamps, setRequestTimestamps] = useState<number[]>([])
  const [remainingRequests, setRemainingRequests] = useState(RATE_LIMIT)
  const [cooldownSeconds, setCooldownSeconds] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Clean up old timestamps and calculate remaining requests
  const updateRateLimitState = useCallback(() => {
    const now = Date.now()
    const validTimestamps = requestTimestamps.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW)

    if (validTimestamps.length !== requestTimestamps.length) {
      setRequestTimestamps(validTimestamps)
    }

    const remaining = RATE_LIMIT - validTimestamps.length
    setRemainingRequests(remaining)

    // Calculate cooldown if rate limited
    if (remaining <= 0 && validTimestamps.length > 0) {
      const oldestTimestamp = Math.min(...validTimestamps)
      const cooldown = Math.ceil((RATE_LIMIT_WINDOW - (now - oldestTimestamp)) / 1000)
      setCooldownSeconds(Math.max(0, cooldown))
    } else {
      setCooldownSeconds(0)
    }
  }, [requestTimestamps])

  // Update rate limit state every second
  useEffect(() => {
    updateRateLimitState()
    const interval = setInterval(updateRateLimitState, 1000)
    return () => clearInterval(interval)
  }, [updateRateLimitState])

  useEffect(() => {
    isHaveValidToken().then((res) => {
      setIsTokenValid(res)
      if (res) {
        toast.success("Welcome! You can start chatting with Etan AI.")
      }
    })
  }, [])

  useEffect(() => {
    if (query && isTokenValid) {
      setLoading(true)
      toast.promise(
        requestAIChat(query).then((res) => {
          setData(res?.data)
          setLoading(false)
        }),
        {
          loading: "Etan is thinking...",
          success: "Response generated!",
          error: (err) => err.message,
        }
      )
    }
  }, [query, isTokenValid])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!inputValue.trim()) {
      toast.error("Please enter a message")
      return
    }

    // Check rate limit
    if (remainingRequests <= 0) {
      toast.error(`Rate limit exceeded. Please wait ${cooldownSeconds} seconds.`)
      return
    }

    // Add current timestamp to track requests
    setRequestTimestamps((prev) => [...prev, Date.now()])

    setQuery(inputValue)
    setInputValue("")
  }

  const isRateLimited = remainingRequests <= 0

  // Loading state while checking token
  if (isTokenValid === null) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  // Not logged in state
  if (!isTokenValid) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16 px-6">
          <div className="p-4 rounded-full bg-muted mb-4">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Authentication Required</h3>
          <p className="text-sm text-muted-foreground text-center mb-6 max-w-sm">Please log in to access Etan AI and start having intelligent conversations.</p>
          <Link href="/auth">
            <Button className="gap-2">
              <Sparkles className="h-4 w-4" />
              Log in to Continue
            </Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Chat Input */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <Input ref={inputRef} type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Ask Etan anything..." className="h-12 text-base" disabled={loading || isRateLimited} />
            <Button type="submit" size="lg" className="h-12 px-6 gap-2" disabled={loading || !inputValue.trim() || isRateLimited}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="hidden sm:inline">Send</span>
            </Button>
          </form>

          {/* Rate Limit Info */}
          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>
                {remainingRequests} / {RATE_LIMIT} requests remaining
              </span>
            </div>
            {isRateLimited && (
              <Badge variant="destructive" className="text-xs">
                Wait {cooldownSeconds}s
              </Badge>
            )}
            {!isRateLimited && remainingRequests < RATE_LIMIT && (
              <Badge variant="secondary" className="text-xs">
                Resets in ~{Math.ceil(RATE_LIMIT_WINDOW / 1000)}s
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Rate Limit Warning */}
      {isRateLimited && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800">
          <CardContent className="flex items-center gap-3 p-4">
            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">Rate limit reached</p>
              <p className="text-xs text-amber-600 dark:text-amber-400">
                You can make {RATE_LIMIT} requests per minute. Please wait {cooldownSeconds} seconds.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Response */}
      {(loading || data) && (
        <Card>
          <CardContent className="p-6">
            {/* User Query */}
            {query && (
              <div className="flex items-start gap-3 mb-6">
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src="https://api.dicebear.com/7.x/initials/svg?seed=You" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1">You</p>
                  <p className="text-sm text-muted-foreground">{query}</p>
                </div>
              </div>
            )}

            {/* AI Response */}
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8 border bg-gradient-to-br from-violet-500/20 to-purple-500/20">
                <AvatarFallback>
                  <Bot className="h-4 w-4 text-violet-500" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-2">Etan AI</p>
                {loading ? (
                  <div className="flex flex-col gap-2">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-4/5 h-4" />
                    <Skeleton className="w-3/5 h-4" />
                    <Skeleton className="w-2/3 h-4" />
                  </div>
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <MDXComponent>{data}</MDXComponent>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && !data && !isRateLimited && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 px-6">
            <div className="p-4 rounded-full bg-gradient-to-br from-violet-500/10 to-purple-500/10 mb-4">
              <Bot className="h-8 w-8 text-violet-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Start a Conversation</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">Type your question above and Etan AI will help you with anything you need.</p>
          </CardContent>
        </Card>
      )}

      {/* Chat History */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span>Chat History</span>
        </h3>
        <AIChat />
      </div>
    </div>
  )
}
