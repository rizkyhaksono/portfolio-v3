import { getAllProject } from "@/services/visitor/project"
import { media_socials } from "@/commons/constants/contact"
import { SectionIcon } from "@/components/layout/section-icons"
import { InkLink } from "@/components/ui/ink-link"
import { Gallery, MediaCard } from "@/components/ui/media-card"
import { PageHeader } from "@/components/ui/page-header"
import { StatusLine } from "@/components/ui/status-line"
import { selectFeaturedProjects } from "./featured"
import { plateOf } from "./project-links"
import { firstSentence, plainText } from "./safe-html"

export const revalidate = 3600

// The server runs in UTC; a project added on a Jakarta New Year's Eve belongs to the new year.
const JAKARTA_YEAR = new Intl.DateTimeFormat("en", { year: "numeric", timeZone: "Asia/Jakarta" })
/** Calendar year in Jakarta, or "Undated" when the date does not parse. */
const yearOf = (iso: string) => {
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? "Undated" : JAKARTA_YEAR.format(date)
}

type Project = Awaited<ReturnType<typeof getAllProject>>[number]

function byYear(projects: Project[]) {
  const years = new Map<string, Project[]>()
  for (const project of projects) {
    const year = yearOf(project.created_at)
    years.set(year, [...(years.get(year) ?? []), project])
  }
  return years
}

const GITHUB = media_socials.find((social) => social.title === "GitHub")?.href ?? "https://github.com/rizkyhaksono"

/** Notion's gallery view grouped by a property: a small muted label with the count, then the cards. */
function ProjectGroup({ id, label, projects, lead }: Readonly<{ id: string; label: string; projects: Project[]; lead?: boolean }>) {
  return (
    <section aria-labelledby={id} className="mt-10 first:mt-0">
      <h2 id={id} className="mb-2 flex items-baseline gap-2 text-small font-medium text-muted-foreground">
        {label}
        <span className="font-normal tabular-nums">
          {projects.length}
          <span className="sr-only"> {projects.length === 1 ? "project" : "projects"}</span>
        </span>
      </h2>
      <Gallery>
        {projects.map((project, i) => (
          <li key={project.id}>
            <MediaCard
              href={`/project/${project.id}`}
              image={plateOf(project)}
              title={project.title}
              description={firstSentence(plainText(project.description))}
              meta={yearOf(project.created_at)}
              priority={lead && i === 0}
            />
          </li>
        ))}
      </Gallery>
    </section>
  )
}

export default async function ProjectPage() {
  // A thrown fetch shows the failed line; Supabase errors already come back as an empty list.
  const projects = await getAllProject().catch(() => null)
  const icon = <SectionIcon href="/project" />

  if (!projects) {
    return (
      <div>
        <PageHeader icon={icon} title="Projects" />
        <StatusLine kind="failed">
          The projects did not load just now. Try again in a few minutes, or browse the code on{" "}
          <span className="whitespace-nowrap">
            <InkLink href={GITHUB} external>
              GitHub
            </InkLink>
            .
          </span>
        </StatusLine>
      </div>
    )
  }

  const featured = selectFeaturedProjects(projects)
  const featuredIds = new Set(featured.map((project) => project.id))
  const rest = projects.filter((project) => !featuredIds.has(project.id))

  return (
    <div>
      <PageHeader
        icon={icon}
        title="Projects"
        description={projects.length > 0 ? `${projects.length.toLocaleString("en")} projects. The hand-picked ones first.` : undefined}
      />

      {projects.length === 0 && <StatusLine kind="empty">No projects are listed right now.</StatusLine>}

      {featured.length > 0 && <ProjectGroup id="hand-picked" label="Hand-picked" projects={featured} lead />}
      {[...byYear(rest)].map(([year, rows], i) => (
        <ProjectGroup key={year} id={`year-${year}`} label={year} projects={rows} lead={featured.length === 0 && i === 0} />
      ))}
    </div>
  )
}
