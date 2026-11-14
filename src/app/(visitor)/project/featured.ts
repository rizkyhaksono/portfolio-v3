// Hand-picked work, matched by title so a Supabase id change cannot drop it. Order is the order on the page.
const FEATURED_PROJECTS = [
  ["info pangan jakarta", "info pangan"],
  ["adaro water solution", "adaro water"],
  ["ecrf biofarma", "ecrf", "biofarma"],
] as const

const normalizeTitle = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim()

/**
 * The featured projects in editorial order. When a title stops matching (a rename), the newest projects with a
 * screenshot fill the gap, so the list never silently shrinks.
 */
export function selectFeaturedProjects<T extends { id: string; title: string; image?: string | null; created_at?: string }>(
  projects: T[],
  count = FEATURED_PROJECTS.length,
): T[] {
  const picked = FEATURED_PROJECTS.flatMap((aliases) => {
    const match = projects.find((project) => aliases.some((alias) => normalizeTitle(project.title).includes(alias)))
    return match ? [match] : []
  })
  const withImage = (project: T) => !!project.image && project.image !== "/no-image.jpg"
  const fill = projects
    .filter((project) => !picked.includes(project) && withImage(project))
    .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
  return [...picked, ...fill].slice(0, count)
}
