import { notFound } from "next/navigation"
import { getAllProject } from "@/services/visitor/project"
import { getPathReads } from "@/services/visitor/umami"
import { ArticleShell } from "@/components/ui/article-shell"
import { InkLink } from "@/components/ui/ink-link"
import { ReaderCount } from "@/components/ui/reader-count"
import ClapButton from "@/components/ui/clap-button"
import ProjectImageViewer from "./_components/project-image-viewer"
import { ProjectLinks, plateOf } from "../project-links"
import { safeHtml } from "../safe-html"

export const revalidate = 3600

/** Prerendered, so the route is ISR like the other articles (without this Next renders it on every request). */
export async function generateStaticParams() {
  return (await getAllProject()).map((project) => ({ id: project.id }))
}

type Props = {
  params: Promise<{ id: string }>
}

const day = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jakarta" })

/** "Added 3 March 2025." plus "Updated 5 May 2025." when it changed on another day. */
function dateline(created: string, updated?: string) {
  const added = day(created)
  const changed = updated ? day(updated) : added
  return changed === added ? `Added ${added}.` : `Added ${added}. Updated ${changed}.`
}

export default async function ProjectDetailPage({ params }: Readonly<Props>) {
  const { id } = await params
  const [projects, reads] = await Promise.all([getAllProject(), getPathReads()])
  const index = projects.findIndex((project) => project.id === id)
  if (index === -1) notFound()

  const project = projects[index]
  const plate = plateOf(project)
  const link = (neighbour?: (typeof projects)[number]) => neighbour && { href: `/project/${neighbour.id}`, title: neighbour.title }

  return (
    <ArticleShell
      title={project.title}
      dateline={dateline(project.created_at, project.updated_at)}
      railLabel="About this project"
      rail={
        <>
          <ProjectLinks project={project} className="flex-col items-start" />
          <ReaderCount path={`/project/${project.id}`} reads={reads} />
          <InkLink href="/project" className="inline-flex min-h-11 items-center md:min-h-0">
            All projects
          </InkLink>
        </>
      }
      footer={<ClapButton targetType="project" targetId={project.id} className="mt-8" />}
      prev={link(projects[index - 1])}
      next={link(projects[index + 1])}
    >
      {plate && <ProjectImageViewer src={plate} alt={`${project.title}, screenshot`} />}
      <div className="[&>*+*]:mt-[1em]" dangerouslySetInnerHTML={{ __html: safeHtml(project.description) }} />
    </ArticleShell>
  )
}
