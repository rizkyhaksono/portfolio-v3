import BlurFade from "@/components/magicui/blur-fade"
import CardProject from "@/app/_components/project/card-project"
import { getAllProject } from "@/services/visitor/project"
import { MacWindow } from "@/components/ui/mac-window"
import { SectionHeading } from "@/components/ui/section-heading"
import { Eyebrow } from "@/components/ui/eyebrow"
import { FeaturedProject } from "@/app/_components/project/featured-project"

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
  const projects = await getAllProject()
  const featuredProjects = selectFeaturedProjects(projects ?? [])
  const featuredIds = new Set(featuredProjects.map((project) => project.id))
  const remainingProjects = (projects ?? []).filter((project) => !featuredIds.has(project.id))

  return (
    <BlurFade delay={0.25} inView>
      <SectionHeading
        as="h1"
        eyebrow="Work"
        title="Selected"
        accent="projects"
        description="A focused record of products, public systems, and engineering work I helped bring into production."
        className="mb-8"
      />
      {featuredProjects.length > 0 ? (
        <section className="mb-14">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <Eyebrow>Featured work</Eyebrow>
              <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Three projects that best represent my work on public information, industrial systems, and health technology.</p>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Selected {String(featuredProjects.length).padStart(2, "0")}
            </span>
          </div>
          <div>
            {featuredProjects.map((project, index) => (
              <FeaturedProject key={project.id} id={project.id} index={index + 1} title={project.title} description={project.description} image={project.image} href={project.url} />
            ))}
          </div>
        </section>
      ) : null}
      <MacWindow title="~/projects">
        {remainingProjects.length > 0 ? <Eyebrow className="mb-5">More projects</Eyebrow> : null}
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {remainingProjects.map((project) => (
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
