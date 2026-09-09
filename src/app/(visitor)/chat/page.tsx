import ChatClient from "./client"
import { getInitialMessages, getCurrentUser } from "@/services/visitor/chat"

export const dynamic = "force-dynamic"

export default async function ChatPage() {
  const [initialMessages, currentUser] = await Promise.all([getInitialMessages(), getCurrentUser()])

  return (
    <ChatClient initialMessages={initialMessages} currentUser={currentUser} />
  )
}
