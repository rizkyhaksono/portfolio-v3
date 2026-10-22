import ChatClient from "./client"
import { getInitialMessages, getCurrentUser } from "@/services/visitor/chat"
import { Button } from "@/components/ui/button"
import { StatusLine } from "@/components/ui/status-line"

export const dynamic = "force-dynamic"

export default async function ChatPage() {
  const [initialMessages, currentUser] = await Promise.all([getInitialMessages(), getCurrentUser()])

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <header className="shrink-0 pb-5">
        <h1 className="font-display text-h1 text-balance text-ink">Chat</h1>
        <p className="mt-2 font-display text-caption text-ink-soft">Times are Jakarta time.</p>
      </header>
      <div aria-hidden className="shrink-0 border-t border-ink" />

      {initialMessages ? (
        <ChatClient initialMessages={initialMessages} currentUser={currentUser} />
      ) : (
        <StatusLine
          kind="failed"
          className="mt-8"
          action={
            <Button asChild variant="outline" size="sm">
              <a href="/chat">Try again</a>
            </Button>
          }
        >
          The letters did not load. The chat server may be down for a moment.
        </StatusLine>
      )}
    </div>
  )
}
