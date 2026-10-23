import { getAIChat, getAIChatById } from "@/services/user/ai"
import { hasSession } from "@/lib/session"
import AIChatLocked from "./_components/ai-chat-locked"
import AIHub from "./_components/ai-hub"
import AIChatApp from "./_components/ai-chat-lazy"

export const dynamic = "force-dynamic"

interface AIPageProps {
  searchParams: Promise<{ tab?: string; chat?: string }>
}

export default async function AIPage({ searchParams }: Readonly<AIPageProps>) {
  const [{ tab, chat: chatId }, signedIn] = await Promise.all([searchParams, hasSession()])
  // The list is a summary, so the chat named in the URL is fetched beside it.
  const [res, opened] = signedIn
    ? await Promise.all([getAIChat().catch(() => null), chatId ? getAIChatById(chatId) : null])
    : [null, null]
  // Chat is a signed-in feature; an expired session (401) gets the same sign-in slip as no cookie.
  const loggedIn = signedIn && res?.status !== 401
  const chat = loggedIn ? (
    <AIChatApp initialSessions={res?.data ?? []} initialChatId={chatId} initialMessages={opened?.messages} />
  ) : (
    <AIChatLocked />
  )

  return <AIHub chat={chat} initialTab={tab ?? (chatId ? "chat" : undefined)} />
}
