import Image from "next/image"
import BlurFade from "@/components/magicui/blur-fade";
import { SectionHeading } from "@/components/ui/section-heading";
import { Chip } from "@/components/ui/chip";
import { getAllEducation } from "@/services/visitor/education";

export default async function EducationSection() {
  const educations = await getAllEducation();

  return (
    <BlurFade delay={0.25} inView>
      <div className="mt-10">
        <SectionHeading
          eyebrow="Education"
          title="Academic"
          accent="foundation"
          description="Where I built the fundamentals behind the work."
        />
        <div className="mt-6 space-y-3">
          {educations?.map((edu: any) => (
            <div
              key={edu.title}
              className="group flex flex-row items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent/40"
            >
              <Image
                src={edu.image}
                alt={`${edu.title} logo`}
                width={1000}
                height={1000}
                className="size-14 shrink-0 rounded-full border border-border object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="font-display text-sm font-semibold text-foreground">{edu.title}</p>
                <p className="text-xs text-muted-foreground">{edu.subtitle}</p>
              </div>
              <Chip className="ml-auto shrink-0 self-start">{edu.duration}</Chip>
            </div>
          ))}
        </div>
      </div>
    </BlurFade>
  )
}
