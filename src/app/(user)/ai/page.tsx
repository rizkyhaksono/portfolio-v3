import BlurFade from "@/components/magicui/blur-fade"
import { MacWindow } from "@/components/ui/mac-window"
import { getAIChat } from "@/services/user/ai"
import { isHaveValidToken } from "@/app/actions/actions"
import AIChatApp from "./_components/ai-chat-app"
import PublicAIChat from "./_components/public-ai-chat"
import OcrDemo from "./_components/ocr-demo"
import AIHub from "./_components/ai-hub"

export const dynamic = "force-dynamic"

export default async function AIPage() {
  const valid = await isHaveValidToken()

  // Chat mode adapts to auth: full Etan AI (with history) when signed in, the functional
  // public RAG demo when logged out — no redirect, so visitors can try it first.
  let chat
  if (valid) {
    const res = await getAIChat().catch(() => null)
    chat = <AIChatApp initialSessions={res?.data ?? []} />
  } else {
    chat = (
      <MacWindow title="etan-ai ~ chat" bodyClassName="p-3 sm:p-5">
        <PublicAIChat />
      </MacWindow>
    )
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
