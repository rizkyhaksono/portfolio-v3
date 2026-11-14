import { CalendarClock, CalendarPlus, Link2 } from "lucide-react"
import { notFound } from "next/navigation"
import { getAllProject } from "@/services/visitor/project"
import { getPathReads } from "@/services/visitor/umami"
import { ArticleShell } from "@/components/ui/article-shell"
import type { Property } from "@/components/ui/properties"
import { ReaderCount } from "@/components/ui/reader-count"
import ClapButton from "@/components/ui/clap-button"
import { httpUrl } from "@/lib/utils"
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

export default async function ProjectDetailPage({ params }: Readonly<Props>) {
  const { id } = await params
  const [projects, reads] = await Promise.all([getAllProject(), getPathReads()])
  const index = projects.findIndex((project) => project.id === id)
  if (index === -1) notFound()

  const project = projects[index]
  const plate = plateOf(project)
  const link = (neighbour?: (typeof projects)[number]) => neighbour && { href: `/project/${neighbour.id}`, title: neighbour.title }

  const added = day(project.created_at)
  const updated = project.updated_at ? day(project.updated_at) : added
  const properties: Property[] = [
    { label: "Added", icon: <CalendarPlus strokeWidth={1.5} />, value: added },
    // Only when it changed on another day than it was added.
    ...(updated !== added ? [{ label: "Updated", icon: <CalendarClock strokeWidth={1.5} />, value: updated }] : []),
    ...(httpUrl(project.url) || httpUrl(project.source_code)
      ? [{ label: "Links", icon: <Link2 strokeWidth={1.5} />, value: <ProjectLinks project={project} /> }]
      : []),
  ]

  return (
    <ArticleShell
      title={project.title}
      properties={properties}
      meta={<ReaderCount path={`/project/${project.id}`} reads={reads} className="text-small" />}
      cover={plate && <ProjectImageViewer src={plate} alt={`${project.title}, screenshot`} />}
      footer={<ClapButton targetType="project" targetId={project.id} className="mt-10" />}
      prev={link(projects[index - 1])}
      next={link(projects[index + 1])}
    >
      <div className="[&>*+*]:mt-[0.75em]" dangerouslySetInnerHTML={{ __html: safeHtml(project.description) }} />
    </ArticleShell>
  )
}
