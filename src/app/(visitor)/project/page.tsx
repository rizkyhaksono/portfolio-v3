import BlurFade from "@/components/magicui/blur-fade"
import CardProject from "@/app/_components/project/card-project"
import { getAllProject } from "@/services/visitor/project"
import { MacWindow } from "@/components/ui/mac-window"
import { SectionHeading } from "@/components/ui/section-heading"

export default async function ProjectPage() {
  const projects = await getAllProject()

  return (
    <BlurFade delay={0.25} inView>
      <SectionHeading
        as="h1"
        eyebrow="Work"
        title="Selected"
        accent="projects"
        description="I have experience working on a wide range of projects, from basic websites to advanced web applications."
        className="mb-8"
      />
      <MacWindow title="~/projects">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects?.map((project) => (
            <CardProject key={project.id} id={project.id} title={project.title} description={project.description} href={project.url} source={project.source_code ?? ""} image={project.image ?? "/no-image.jpg"} />
          ))}
        </div>
        {(!projects || projects.length === 0) && (
          <p className="py-12 text-center text-sm text-muted-foreground">No projects to show yet.</p>
        )}
      </MacWindow>
    </BlurFade>
  )
}
