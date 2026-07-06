import BlurFade from "@/components/magicui/blur-fade"
import { SectionHeading } from "@/components/ui/section-heading"
import { Chip } from "@/components/ui/chip"
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
        <SectionHeading eyebrow="Career" title="Work" accent="Experience" />

        <div className="mt-6">
          {Array.from(groupedCareers.entries()).map(([companyName, companyCarers]) => (
            <div key={companyName} className="relative">
              {companyCarers.length > 1 && <div className="absolute left-[31px] top-[72px] bottom-4 w-px bg-border" />}

              {companyCarers.map((career: any, idx: number) => (
                <div key={career.id} className="relative">
                  {idx > 0 && <div className="absolute left-[28px] top-[26px] w-2 h-2 rounded-full bg-primary z-10" />}
                  <div className="max-w-full text-pretty mt-3 flex flex-row items-start gap-4">
                    {idx === 0 ? <FallbackImage src={career.image} alt={`${career.title} logo`} width={64} height={64} className="rounded-full object-cover size-16 flex-shrink-0 ring-1 ring-border" /> : <div className="size-16 flex-shrink-0" />}
                    <div className="flex-1">
                      <h3 className="font-display text-sm sm:text-base font-semibold leading-snug tracking-tight text-foreground">{career.title}</h3>
                      <p className="mt-0.5 text-muted-foreground text-xs sm:text-sm">{career.subtitle}</p>
                    </div>
                    <Chip className="ml-auto self-start whitespace-nowrap">{career.duration}</Chip>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </BlurFade>
  )
}
