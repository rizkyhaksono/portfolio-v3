import ChatClient from "./client"
import { getInitialMessages, getCurrentUser } from "@/services/visitor/chat"
import { Button } from "@/components/ui/button"
import { StatusLine } from "@/components/ui/status-line"

export const dynamic = "force-dynamic"

export default async function ChatPage() {
  const [initialMessages, currentUser] = await Promise.all([getInitialMessages(), getCurrentUser()])

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <header className="shrink-0 pb-8">
        <h1 className="speckle text-h1 text-balance text-foreground">Chat</h1>
        <p className="mt-4 text-caption text-muted-foreground">Times are Jakarta time.</p>
      </header>
      <div aria-hidden className="shrink-0 border-t border-foreground" />

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
