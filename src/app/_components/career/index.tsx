import BlurFade from "@/components/magicui/blur-fade"
import Typography from "@/components/ui/typography"
import { getAllCarrer } from "@/services/visitor/career"
import { FallbackImage } from "@/components/ui/fallback-image"

export default async function CarrerSection() {
  const careers = await getAllCarrer()

  return (
    <BlurFade delay={0.25} inView>
      <div className="mt-10">
        <Typography.H4>Work Experience</Typography.H4>
        {careers?.map((career: any) => (
          <div key={career.id} className="prose max-w-full text-pretty font-sans text-sm dark:prose-invert mt-2 flex flex-row gap-4">
            <FallbackImage src={career.image} alt={`${career.title} logo`} width={64} height={64} className="rounded-full object-cover size-16 justify-self-start" />
            <div className="flex-1">
              <Typography.P>{career.title}</Typography.P>
              <Typography.P className="text-muted-foreground text-xs">{career.subtitle}</Typography.P>
            </div>
            <div className="text-end text-xs ml-auto self-start">{career.duration}</div>
          </div>
        ))}
      </div>
    </BlurFade>
  )
}
