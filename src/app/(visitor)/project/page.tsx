import Image from "next/image"
import { getAllProject } from "@/services/visitor/project"
import { getPathReads } from "@/services/visitor/umami"
import { InkLink } from "@/components/ui/ink-link"
import { LedgerList, LedgerRow } from "@/components/ui/ledger"
import { PlateFigure } from "@/components/ui/plate-figure"
import { ReaderCount } from "@/components/ui/reader-count"
import { PAGE_WIDTH, SECTION_SPACING } from "@/lib/design-system"
import { ProjectLinks, plateOf } from "./project-links"
import { plainText } from "./safe-html"

export const revalidate = 3600

const FEATURED_PROJECTS = [
  ["info pangan jakarta", "info pangan"],
  ["adaro water solution", "adaro water"],
  ["ecrf biofarma", "ecrf", "biofarma"],
] as const

/** Normalizes project titles before curated matching. */
function normalizeTitle(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()
}

/** Picks the requested projects in a stable editorial order. */
function selectFeaturedProjects<T extends { title: string }>(projects: T[]): T[] {
  return FEATURED_PROJECTS.flatMap((aliases) => {
    const match = projects.find((project) => aliases.some((alias) => normalizeTitle(project.title).includes(alias)))
    return match ? [match] : []
  })
}

export default async function ProjectPage() {
  const [projects, reads] = await Promise.all([getAllProject(), getPathReads()])
  const featured = selectFeaturedProjects(projects)
  const featuredIds = new Set(featured.map((project) => project.id))
  const rest = projects.filter((project) => !featuredIds.has(project.id))
  // The first featured plate is the LCP image on phones, so it must not wait as a lazy image.
  const leadPlateId = featured.find((project) => plateOf(project))?.id

  return (
    <div className={PAGE_WIDTH.ledger}>
      <header className="pb-8">
        <h1 className="font-display text-h1 text-balance text-ink">Projects</h1>
        <p className="mt-4 max-w-[46ch] font-display text-lead text-ink-soft">
          Products, public systems and engineering work I helped bring into production.
        </p>
      </header>
      <div aria-hidden className="h-[5px] border-y border-b-rule border-t-ink" />

      {projects.length === 0 && <p className="mt-8 text-body text-ink-soft">No projects are published yet.</p>}

      {featured.length > 0 && (
        <section aria-labelledby="featured" className="mt-12">
          <h2 id="featured" className="font-display text-h2 text-ink">
            Featured
          </h2>
          <div className="mt-6 border-t border-ink">
            {featured.map((project) => {
              const plate = plateOf(project)
              return (
                <article key={project.id} className="grid gap-6 border-b border-rule py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] md:gap-10">
                  <div className="min-w-0">
                    <h3 className="font-display text-h3 text-balance text-ink">
                      <InkLink href={`/project/${project.id}`} className="no-underline hover:underline">
                        {project.title}
                      </InkLink>
                    </h3>
                    <p className="mt-3 line-clamp-4 text-body text-ink-soft">{plainText(project.description)}</p>
                    <ReaderCount path={`/project/${project.id}`} reads={reads} className="mt-3" />
                    <ProjectLinks project={project} className="mt-3" />
                  </div>
                  {plate && (
                    <PlateFigure className="order-first md:sticky md:order-none md:top-[calc(var(--head-h)+1.5rem)] md:self-start">
                      <div className="relative aspect-[16/10]">
                        <Image src={plate} alt="" fill priority={project.id === leadPlateId} sizes="(min-width: 768px) 20rem, 100vw" className="object-cover object-top" />
                      </div>
                    </PlateFigure>
                  )}
                </article>
              )
            })}
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section aria-labelledby="more" className={SECTION_SPACING.section}>
          <h2 id="more" className="font-display text-h2 text-ink">
            {featured.length > 0 ? "More projects" : "All projects"}
          </h2>
          <LedgerList className="mt-6">
            {rest.map((project) => (
              <LedgerRow key={project.id} title={project.title} href={`/project/${project.id}`} meta={new Date(project.created_at).getFullYear() || null}>
                <p className="line-clamp-2">{plainText(project.description)}</p>
                <ReaderCount path={`/project/${project.id}`} reads={reads} className="mt-1" />
                <ProjectLinks project={project} className="mt-1" />
              </LedgerRow>
            ))}
          </LedgerList>
        </section>
      )}
    </div>
  )
}
