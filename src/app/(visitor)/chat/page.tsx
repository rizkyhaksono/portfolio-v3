import BlurFade from "@/components/magicui/blur-fade"
import { MessageCircle } from "lucide-react"
import ChatClient from "./client"
import { getInitialMessages, getCurrentUser } from "@/services/visitor/chat"

export const dynamic = "force-dynamic"

export default async function ChatPage() {
  const [initialMessages, currentUser] = await Promise.all([getInitialMessages(), getCurrentUser()])

  return (
    <BlurFade delay={0.25} inView>
      <div className="mb-6 text-center">
        <h1 className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-bold tracking-tight">
          <MessageCircle className="h-6 w-6 text-primary" />
          Realtime Chat
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">A public space for discussions — be respectful and have fun!</p>
      </div>

      <ChatClient initialMessages={initialMessages} currentUser={currentUser} />
    </BlurFade>
  )
}
