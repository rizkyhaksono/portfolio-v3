import BlurFade from "@/components/magicui/blur-fade"
import Link from "next/link"
import { getAIChat } from "@/services/user/ai"
import { isHaveValidToken } from "@/app/actions/actions"
import AIChatApp from "./_components/ai-chat-app"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Lock, Sparkles } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AIPage() {
  const valid = await isHaveValidToken()

  if (!valid) {
    return (
      <BlurFade delay={0.2} inView>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center px-6 py-16">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Lock className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Authentication Required</h3>
            <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
              Please log in to access Etan AI and start chatting.
            </p>
            <Link href="/auth">
              <Button className="gap-2">
                <Sparkles className="h-4 w-4" />
                Log in to Continue
              </Button>
            </Link>
          </CardContent>
        </Card>
      </BlurFade>
    )
  }

  const res = await getAIChat().catch(() => null)
  const sessions = res?.data ?? []

  return (
    <BlurFade delay={0.2} inView>
      <AIChatApp initialSessions={sessions} />
    </BlurFade>
  )
}
