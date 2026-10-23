import { InkLink } from "@/components/ui/ink-link"
import { cn, httpUrl } from "@/lib/utils"
import type { getAllProject } from "@/services/visitor/project"

type Project = Awaited<ReturnType<typeof getAllProject>>[number]

const TARGET = "inline-flex min-h-11 items-center md:min-h-0"

export const plateOf = (project: Project) => (project.image && project.image !== "/no-image.jpg" ? project.image : null)

/** The live site and the source, each tracked per project. Sits above the row's stretched link. */
export function ProjectLinks({ project, className }: Readonly<{ project: Project; className?: string }>) {
  const site = httpUrl(project.url)
  const source = httpUrl(project.source_code)
  if (!site && !source) return null
  return (
    <span className={cn("relative z-10 flex flex-wrap gap-x-6", className)}>
      {site && (
        <InkLink href={site} external event="project-site" eventData={{ project: project.title }} className={TARGET}>
          Visit the site
        </InkLink>
      )}
      {source && (
        <InkLink href={source} external event="project-source" eventData={{ project: project.title }} className={TARGET}>
          Source code
        </InkLink>
      )}
    </span>
  )
}
