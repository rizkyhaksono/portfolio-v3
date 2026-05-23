import Link from "next/link"
import BlurFade from "@/components/magicui/blur-fade"
import { getAIChatById } from "@/services/user/ai"
import AIChatDetailForm from "../_components/ai-chat-detail-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export const dynamic = "force-dynamic"

type AIChatProps = {
  params: Promise<{ id: string }>
}

const AIChatID = async (props: AIChatProps) => {
  const { id } = await props.params
  const response = await getAIChatById(id)
  const chat = response?.data

  if (!chat) {
    return (
      <BlurFade>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Chat not found.</p>
          <Link href="/ai">
            <Button variant="link" className="mt-4">
              Back to Etan AI
            </Button>
          </Link>
        </div>
      </BlurFade>
    )
  }

  return (
    <BlurFade>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/ai">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold">{chat.title || "Conversation"}</h1>
            <p className="text-sm text-muted-foreground">
              {new Date(chat.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <AIChatDetailForm chatId={id} initialMessages={chat.messages ?? []} />
      </div>
    </BlurFade>
  )
}

export default AIChatID
