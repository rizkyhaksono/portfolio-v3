import { Button } from "@/components/ui/button";
import CardProject from "@/components/layout/user/card-project";
import { getAllProject } from "@/lib/services/project";

export default async function ProjectPage() {
  const projects = await getAllProject();

  return (
    <>
      <div className="text-center">
        <Button className="text-base font-semibold" variant={"default"} size={"sm"}>
          Projects
        </Button>
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
    </>
  )
}