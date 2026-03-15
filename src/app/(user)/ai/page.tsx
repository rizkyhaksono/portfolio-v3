import BlurFade from "@/components/magicui/blur-fade"
import AIForm from "./_components/ai-form"

export const dynamic = "force-static"

export default function AIPage() {
  return (
    <BlurFade delay={0.25} inView>
      <AIForm />
    </BlurFade>
  )
}
