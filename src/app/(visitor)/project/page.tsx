import BlurFade from "@/components/magicui/blur-fade"
import CardProject from "@/app/_components/project/card-project"
import { getAllProject } from "@/services/visitor/project"
import { FolderGit2 } from "lucide-react"

export default async function ProjectPage() {
  const projects = await getAllProject()

  return (
    <BlurFade delay={0.25} inView>
      <div className="mb-8 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <FolderGit2 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Projects</h1>
        </div>
        <p className="mx-auto max-w-xl text-sm text-muted-foreground">
          I have experience working on a wide range of projects, from basic websites to advanced web applications.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects?.map((project) => (
          <CardProject key={project.id} id={project.id} title={project.title} description={project.description} href={project.url} source={project.source_code ?? ""} image={project.image ?? "/no-image.jpg"} />
        ))}
      </div>
      {(!projects || projects.length === 0) && (
        <p className="py-12 text-center text-sm text-muted-foreground">No projects to show yet.</p>
      )}
    </BlurFade>
  )
}
