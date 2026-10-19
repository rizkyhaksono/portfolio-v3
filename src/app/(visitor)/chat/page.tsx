import ChatClient from "./client"
import { getInitialMessages, getCurrentUser } from "@/services/visitor/chat"

export const dynamic = "force-dynamic"

export default async function ChatPage() {
  const [initialMessages, currentUser] = await Promise.all([getInitialMessages(), getCurrentUser()])

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-[66ch] flex-1 flex-col">
      <header className="shrink-0 pb-5">
        <h1 className="font-display text-h2 text-balance text-ink sm:text-h1">Chat</h1>
        <p className="mt-2 max-w-[52ch] font-display text-body text-ink-soft sm:mt-3 sm:text-lead">
          Say hello, ask a question, or answer someone. Everything written here is public.
        </p>
        <p className="mt-2 font-display text-caption text-ink-soft">Times are Jakarta time.</p>
      </header>
      <div aria-hidden className="h-[5px] shrink-0 border-y border-b-rule border-t-ink" />

      <ChatClient initialMessages={initialMessages} currentUser={currentUser} />
    </div>
  )
}
