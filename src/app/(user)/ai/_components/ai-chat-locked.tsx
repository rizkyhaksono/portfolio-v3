import Link from "next/link"
import { Lock, Bot, LogIn } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Fake bubbles just to shape the skeleton — chat history is a per-user feature, so the
// public gets a blurred preview of the real UI behind a sign-in gate, never live content.
const BUBBLES = [
  { side: "left", w: "w-3/5" },
  { side: "right", w: "w-2/5" },
  { side: "left", w: "w-4/5" },
  { side: "right", w: "w-1/3" },
] as const

/** Logged-out placeholder for Etan AI: a dimmed, non-interactive skeleton of the real chat
 *  (mirrors AIChatApp's shell) behind a "sign in to continue" card. */
export default function AIChatLocked() {
  return (
    <div className="relative flex h-[calc(100dvh-16rem)] min-h-[460px] flex-col overflow-hidden rounded-none border bg-card shadow-sm">
      {/* Skeleton of the real chat — dimmed & non-interactive behind the gate */}
      <div aria-hidden className="pointer-events-none flex h-full select-none flex-col opacity-60 blur-[2px]">
        {/* mac window title bar */}
        <div className="flex shrink-0 items-center gap-3 border-b bg-muted/40 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-400/90" />
            <span className="h-3 w-3 rounded-full bg-yellow-400/90" />
            <span className="h-3 w-3 rounded-full bg-green-400/90" />
          </div>
          <p className="flex-1 truncate text-center font-mono text-xs text-muted-foreground">etan-ai ~ chat</p>
          <div className="w-[46px] shrink-0" />
        </div>

        <div className="flex min-h-0 flex-1">
          {/* Sessions sidebar skeleton */}
          <aside className="hidden w-64 shrink-0 flex-col border-r bg-muted/30 md:flex">
            <div className="border-b p-3">
              <Skeleton className="h-9 w-full rounded-none" />
            </div>
            <div className="flex-1 space-y-2 p-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-1.5 rounded-none p-2.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
              ))}
            </div>
          </aside>

          {/* Conversation skeleton */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-center gap-3 border-b p-3">
              <Avatar className="h-9 w-9 border bg-gradient-to-br from-violet-500/20 to-purple-500/20">
                <AvatarFallback>
                  <Bot className="h-5 w-5 text-violet-500" />
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>

            <div className="flex-1 space-y-4 p-4">
              {BUBBLES.map((b, i) => (
                <div key={i} className={cn("flex gap-3", b.side === "right" ? "flex-row-reverse" : "flex-row")}>
                  <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                  <Skeleton className={cn("h-14 rounded-none", b.w)} />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 border-t p-3">
              <Skeleton className="h-11 flex-1 rounded-none" />
              <Skeleton className="h-11 w-11 shrink-0 rounded-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Sign-in gate */}
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/40 p-4 backdrop-blur-[1px]">
        <div className="flex max-w-sm flex-col items-center gap-4 rounded-none border bg-card/95 p-6 text-center shadow-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-none bg-primary/10 text-primary">
            <Lock className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold">Sign in to use Etan AI</h3>
            <p className="text-sm text-muted-foreground">
              Chat with my portfolio assistant and keep your conversation history — sign in to get started.
            </p>
          </div>
          <Button asChild className="w-full gap-2 rounded-none">
            <Link href="/auth">
              <LogIn className="h-4 w-4" />
              Sign in
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
