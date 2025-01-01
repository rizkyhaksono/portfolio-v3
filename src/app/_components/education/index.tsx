import Image from "next/image"
import BlurFade from "@/components/magicui/blur-fade";
import { getAllEducation } from "@/services/visitor/education";

export default async function EducationSection() {
  const educations = await getAllEducation();

  return (
    <BlurFade delay={0.25} inView>
      <div className="mt-10">
        <p className="text-left text-xl font-semibold">Education</p>
        {educations?.map((edu: any) => (
          <div
            key={edu.title}
            className="prose max-w-full text-pretty font-sans text-sm dark:prose-invert mt-2 flex flex-row gap-4"
          >
            <Image
              src={edu.image}
              alt={`${edu.title} logo`}
              width={1000}
              height={1000}
              className="rounded-full object-cover size-16 justify-self-start"
            />
            <div className="flex-1">
              <p>{edu.title}</p>
              <p className="text-muted-foreground text-xs">{edu.subtitle}</p>
            </div>
            <div className="text-end text-xs ml-auto self-start">
              {edu.duration}
            </div>
          </div>
        ))}
      </div>
    </BlurFade>
  )
}