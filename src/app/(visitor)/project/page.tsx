import { getAllProject } from "@/services/visitor/project"
import { getPathReads } from "@/services/visitor/umami"
import { media_socials } from "@/commons/constants/contact"
import { InkLink } from "@/components/ui/ink-link"
import { LedgerList, LedgerRow } from "@/components/ui/ledger"
import { MediaCard } from "@/components/ui/media-card"
import { PageHeader } from "@/components/ui/page-header"
import { PageSection } from "@/components/ui/page-section"
import { ReaderCount } from "@/components/ui/reader-count"
import { StatusLine } from "@/components/ui/status-line"
import { selectFeaturedProjects } from "./featured"
import { ProjectLinks, plateOf } from "./project-links"
import { plainText } from "./safe-html"

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

export default async function ProjectPage() {
  // A thrown fetch shows the failed line; Supabase errors already come back as an empty list.
  const [projects, reads] = await Promise.all([getAllProject().catch(() => null), getPathReads()])

  if (!projects) {
    return (
      <div>
        <PageHeader title="Projects" />
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
        title="Projects"
        description={projects.length > 0 ? `${projects.length.toLocaleString("en")} projects. The hand-picked ones first.` : undefined}
      />

      {projects.length === 0 && <StatusLine kind="empty">No projects are listed right now.</StatusLine>}

      {featured.length > 0 && (
        <section aria-labelledby="featured" className="space-y-12">
          <h2 id="featured" className="sr-only">
            Hand-picked projects
          </h2>
          {featured.map((project, i) => (
            <div key={project.id}>
              <MediaCard
                href={`/project/${project.id}`}
                image={plateOf(project)}
                title={project.title}
                description={plainText(project.description)}
                meta={yearOf(project.created_at)}
                priority={i === 0}
              />
              <ReaderCount path={`/project/${project.id}`} reads={reads} className="mt-1" />
              <ProjectLinks project={project} className="mt-1 text-small" />
            </div>
          ))}
        </section>
      )}

      {rest.length > 0 && (
        <PageSection heading={{ title: featured.length > 0 ? "More projects" : "All projects" }}>
          {[...byYear(rest)].map(([year, rows]) => (
            <LedgerList key={year} marker={<h3>{year}</h3>}>
              {rows.map((project) => (
                <LedgerRow key={project.id} title={project.title} href={`/project/${project.id}`} titleAs="h4">
                  <p className="line-clamp-2">{plainText(project.description)}</p>
                  <ReaderCount path={`/project/${project.id}`} reads={reads} className="mt-1" />
                  <ProjectLinks project={project} className="mt-1 text-small" />
                </LedgerRow>
              ))}
            </LedgerList>
          ))}
        </PageSection>
      )}
    </div>
  )
}
