import BlurFade from "@/components/magicui/blur-fade";
import CardProject from "@/components/layout/user/card-project";
import { getAllProject } from "@/lib/services/project";

export default async function ProjectPage() {
  const projects = await getAllProject();

  return (
    <BlurFade delay={0.25} inView>
      <div className="text-center">
        <p className="text-center text-xl font-semibold">Project</p>
        <div className="mt-2 text-sm text-muted-foreground">
          {`I have experience working on a wide range of projects, from basic websites to advanced web applications.`}
        </div>
      </div>
      <div className="grid max-[760px]:grid-cols-1 grid-cols-2 gap-2 mt-4">
        {projects?.map((project) => (
          <CardProject
            key={project.id}
            title={project.title}
            description={project.description}
            href={project.url}
            source={project.source_code ?? ""}
            image={project.image || "/no-image.jpg"}
          />
        ))}
      </div>
    </BlurFade>
  )
}