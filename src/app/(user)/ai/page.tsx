import BlurFade from "@/components/magicui/blur-fade"
import { MacWindow } from "@/components/ui/mac-window"
import { getAIChat } from "@/services/user/ai"
import { isHaveValidToken } from "@/app/actions/actions"
import AIChatApp from "./_components/ai-chat-app"
import AIChatLocked from "./_components/ai-chat-locked"
import OcrDemo from "./_components/ocr-demo"
import AIHub from "./_components/ai-hub"

export const dynamic = "force-dynamic"

export default async function AIPage() {
  const valid = await isHaveValidToken()

  // Chat is a signed-in feature: full Etan AI with saved history when authenticated,
  // otherwise a skeleton preview behind a sign-in gate (no public access to the chat).
  let chat
  if (valid) {
    const res = await getAIChat().catch(() => null)
    chat = <AIChatApp initialSessions={res?.data ?? []} />
  } else {
    chat = <AIChatLocked />
  }

  const docTool = (
    <MacWindow title="etan-ai ~ document" bodyClassName="p-3 sm:p-5">
      <OcrDemo />
    </MacWindow>
  )

  return (
    <BlurFade delay={0.2} inView>
      <AIHub chat={chat} docTool={docTool} loggedIn={valid} />
    </BlurFade>
  )
}
