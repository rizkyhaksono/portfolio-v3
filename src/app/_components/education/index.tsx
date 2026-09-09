import Image from "next/image"
import BlurFade from "@/components/magicui/blur-fade"
import { PageSection } from "@/components/ui/page-section"
import { Surface } from "@/components/ui/surface"
import { Chip } from "@/components/ui/chip"
import { getAllEducation } from "@/services/visitor/education"

export default async function EducationSection() {
  const educations = await getAllEducation()

  return (
    <BlurFade delay={0.25} inView>
      <PageSection
        heading={{
          eyebrow: "Education",
          title: "Academic",
          accent: "foundation",
          description: "Where I built the fundamentals behind the work.",
        }}
      >
        <div className="space-y-3">
          {educations?.map((edu: { title: string; image: string; subtitle: string; duration: string }) => (
            <Surface
              key={edu.title}
              variant="solid"
              padding="compact"
              className="group grid grid-cols-[3.5rem_minmax(0,1fr)] items-center gap-x-4 gap-y-3 hover:bg-accent/40 sm:grid-cols-[3.5rem_minmax(0,1fr)_auto]"
            >
              <Image
                src={edu.image}
                alt={`${edu.title} logo`}
                width={1000}
                height={1000}
                className="row-span-2 size-14 shrink-0 rounded-full border border-border object-cover sm:row-span-1"
              />
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-semibold leading-snug text-foreground sm:text-base">{edu.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">{edu.subtitle}</p>
              </div>
              <Chip className="col-start-2 w-fit shrink-0 sm:col-start-3 sm:row-start-1">{edu.duration}</Chip>
            </Surface>
          ))}
        </div>
      </PageSection>
    </BlurFade>
  )
}
