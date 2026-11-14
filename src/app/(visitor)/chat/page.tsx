import ChatClient from "./client"
import { getInitialMessages, getCurrentUser } from "@/services/visitor/chat"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import { StatusLine } from "@/components/ui/status-line"

export const dynamic = "force-dynamic"

export default async function ChatPage() {
  const [initialMessages, currentUser] = await Promise.all([getInitialMessages(), getCurrentUser()])

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col">
      <PageHeader
        title="Chat"
        description="A public room: say hello, ask a question or answer someone. Times are Jakarta time."
        className="mb-4 shrink-0"
      />

      {initialMessages ? (
        <ChatClient initialMessages={initialMessages} currentUser={currentUser} />
      ) : (
        <StatusLine
          kind="failed"
          className="mt-4"
          action={
            <Button asChild variant="outline" size="sm">
              <a href="/chat">Try again</a>
            </Button>
          }
        >
          The messages did not load. The chat server may be down for a moment.
        </StatusLine>
      )}
    </div>
  )
}
