import BlurFade from "@/components/magicui/blur-fade"
import { SectionHeading } from "@/components/ui/section-heading"
import ChatClient from "./client"
import { getInitialMessages, getCurrentUser } from "@/services/visitor/chat"

export const dynamic = "force-dynamic"

export default async function ChatPage() {
  const [initialMessages, currentUser] = await Promise.all([getInitialMessages(), getCurrentUser()])

  return (
    <BlurFade delay={0.25} inView>
      <SectionHeading
        align="center"
        eyebrow="Community"
        title="Realtime"
        accent="Chat"
        description="A public space for discussions — be respectful and have fun!"
        className="mb-6"
      />

      <ChatClient initialMessages={initialMessages} currentUser={currentUser} />
    </BlurFade>
  )
}
