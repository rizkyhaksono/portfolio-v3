import ChatClient from "./client"
import { getInitialMessages, getCurrentUser } from "@/services/visitor/chat"

export const dynamic = "force-dynamic"

export default async function ChatPage() {
  const [initialMessages, currentUser] = await Promise.all([getInitialMessages(), getCurrentUser()])

  return (
    <div className="mx-auto w-full max-w-[66ch]">
      <header className="pb-8">
        <h1 className="font-display text-h1 text-balance text-ink">Chat</h1>
        <p className="mt-4 max-w-[46ch] font-display text-lead text-ink-soft">
          Say hello, ask a question, or answer someone. Everything written here is public.
        </p>
        <p className="mt-4 font-display text-caption text-ink-soft">Times are Jakarta time.</p>
      </header>
      <div aria-hidden className="h-[5px] border-y border-b-rule border-t-ink" />

      <ChatClient initialMessages={initialMessages} currentUser={currentUser} />
    </div>
  )
}
