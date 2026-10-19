import { getAIChat } from "@/services/user/ai"
import { isHaveValidToken } from "@/app/actions/actions"
import AIChatLocked from "./_components/ai-chat-locked"
import AIHub from "./_components/ai-hub"
import AIChatApp from "./_components/ai-chat-lazy"

export const dynamic = "force-dynamic"

interface AIPageProps {
  searchParams: Promise<{ tab?: string; chat?: string }>
}

export default async function AIPage({ searchParams }: Readonly<AIPageProps>) {
  const [{ tab, chat: chatId }, valid] = await Promise.all([searchParams, isHaveValidToken()])
  const res = valid ? await getAIChat().catch(() => null) : null
  // Chat is a signed-in feature; an expired session (401) gets the same sign-in slip as no cookie.
  const loggedIn = valid && res?.status !== 401
  const chat = loggedIn ? <AIChatApp initialSessions={res?.data ?? []} initialChatId={chatId} /> : <AIChatLocked />

  return <AIHub chat={chat} initialTab={chatId ? "chat" : tab} />
}
