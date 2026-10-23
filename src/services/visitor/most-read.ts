import { unstable_cache } from "next/cache"
import { getBlogData } from "@/services/visitor/blog"
import { getOnsiteBlogPosts } from "@/services/visitor/onsite-blog"
import { getAllProject } from "@/services/visitor/project"

const MIN_READERS = 10
const ARTICLE_PATH = /^\/(blog|project)\/./

/** The fulfilled list, or nothing when that source failed. */
const listOf = <T,>(result: PromiseSettledResult<T[] | null | undefined>) =>
  result.status === "fulfilled" ? (result.value ?? []) : []

// Inside unstable_cache the source fetches neither lower a page's ISR window nor make it dynamic; titles change
// rarely, so one lookup an hour, shared by the home Readers section and /stats.
const articleTitles = unstable_cache(
  async (): Promise<[string, string][]> => {
    const [devto, onsite, projects] = await Promise.allSettled([getBlogData(), getOnsiteBlogPosts(), getAllProject()])
    return [
      ...listOf(devto).map((post): [string, string] => [`/blog/${post.slug}`, post.title]),
      ...listOf(onsite).map((post): [string, string] => [`/blog/onsite/${post.slug}`, post.title]),
      ...listOf(projects).map((project): [string, string] => [`/project/${project.id}`, project.title]),
    ]
  },
  ["article-titles"],
  { revalidate: 3600 },
)

/** The five most read posts and projects with at least ten readers, titled. */
export async function mostRead(reads: Map<string, number>) {
  const candidates = [...reads].filter(([path, n]) => n >= MIN_READERS && ARTICLE_PATH.test(path))
  if (candidates.length === 0) return []
  const titles = new Map(await articleTitles().catch(() => []))
  return candidates
    .filter(([path]) => titles.has(path))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([path, readers]) => ({ path, readers, title: titles.get(path) as string }))
}
