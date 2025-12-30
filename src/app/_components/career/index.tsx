import BlurFade from "@/components/magicui/blur-fade"
import Typography from "@/components/ui/typography"
import { getAllCarrer } from "@/services/visitor/career"
import { FallbackImage } from "@/components/ui/fallback-image"

function getCompanyName(title: string): string {
  return title.split(" - ")[0].trim()
}

function groupCareersByCompany(careers: any[]): Map<string, any[]> {
  const grouped = new Map<string, any[]>()

  for (const career of careers) {
    const companyName = getCompanyName(career.title)
    const existing = grouped.get(companyName) || []
    existing.push(career)
    grouped.set(companyName, existing)
  }

  return grouped
}

export default async function CarrerSection() {
  const careers = await getAllCarrer()
  if (!careers || careers.length === 0) return null

  const groupedCareers = groupCareersByCompany(careers)

  return (
    <BlurFade delay={0.25} inView>
      <div className="mt-10">
        <Typography.H4>Work Experience</Typography.H4>

        {Array.from(groupedCareers.entries()).map(([companyName, companyCarers]) => (
          <div key={companyName} className="relative">
            {companyCarers.length > 1 && <div className="absolute left-[31px] top-[72px] bottom-4 w-[2px] bg-muted-foreground/30" />}

            {companyCarers.map((career: any, idx: number) => (
              <div key={career.id} className="relative">
                {idx > 0 && <div className="absolute left-[28px] top-[26px] w-2 h-2 rounded-full bg-foreground z-10" />}
                <div className="prose max-w-full text-pretty font-sans text-sm dark:prose-invert mt-2 flex flex-row gap-4">
                  {idx === 0 ? <FallbackImage src={career.image} alt={`${career.title} logo`} width={64} height={64} className="rounded-full object-cover size-16 flex-shrink-0" /> : <div className="size-16 flex-shrink-0" />}
                  <div className="flex-1">
                    <Typography.P>{career.title}</Typography.P>
                    <Typography.P className="text-muted-foreground text-xs">{career.subtitle}</Typography.P>
                  </div>
                  <div className="text-end text-xs ml-auto self-start">{career.duration}</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </BlurFade>
  )
}
