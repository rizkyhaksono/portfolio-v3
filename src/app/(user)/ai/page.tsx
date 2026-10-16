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
  const res = valid ? await getAIChat().catch(() => null) : null
  // Chat is a signed-in feature; an expired session (401) gets the same sign-in gate as no cookie.
  const loggedIn = valid && res?.status !== 401
  const chat = loggedIn ? <AIChatApp initialSessions={res?.data ?? []} /> : <AIChatLocked />

  const docTool = (
    <MacWindow title="etan-ai ~ document" bodyClassName="p-3 sm:p-5">
      <OcrDemo />
    </MacWindow>
  )

  return (
    <BlurFade delay={0.2} inView>
      <AIHub chat={chat} docTool={docTool} loggedIn={loggedIn} />
    </BlurFade>
  )
}
