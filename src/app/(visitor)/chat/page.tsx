import BlurFade from "@/components/magicui/blur-fade"
import { MessageCircle } from "lucide-react"
import ChatClient from "./client"
import { getInitialMessages, getCurrentUser } from "@/services/visitor/chat"

export default async function ChatPage() {
  const [initialMessages, currentUser] = await Promise.all([getInitialMessages(), getCurrentUser()])

  return (
    <BlurFade delay={0.25} inView>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <MessageCircle className="w-8 h-8" />
          Public Chat
        </h1>
        <p className="text-muted-foreground">A public space for discussions. Be respectful and have fun!</p>
      </div>

      <ChatClient initialMessages={initialMessages} currentUser={currentUser} />
    </BlurFade>
  )
}
