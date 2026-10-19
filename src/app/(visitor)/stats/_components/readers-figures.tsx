import { unstable_cache } from "next/cache"
import { PageSection } from "@/components/ui/page-section"
import { LedgerList, LedgerRow } from "@/components/ui/ledger"
import { InkChart } from "@/components/ui/ink-chart"
import { ReadingNow } from "@/components/ui/reading-now"
import type { UmamiStats } from "@/commons/types/umami"
import type { UmamiTimeseries } from "@/services/visitor/umami"
import { getBlogData } from "@/services/visitor/blog"
import { getOnsiteBlogPosts } from "@/services/visitor/onsite-blog"
import { cn } from "@/lib/utils"
import { getAllProject } from "@/services/visitor/project"

const MIN_READERS = 10
const ARTICLE_PATH = /^\/(blog|project)\/./

const listOf = <T,>(result: PromiseSettledResult<T[] | null | undefined>) =>
  result.status === "fulfilled" ? (result.value ?? []) : []

// shortcut: same lookup as the home Readers section (src/app/_components/site-stats), copied because that file
// is out of this change's scope; move both into one shared module when either is next touched.
const articleTitles = unstable_cache(
  async (): Promise<[string, string][]> => {
    const [devto, onsite, projects] = await Promise.allSettled([getBlogData(), getOnsiteBlogPosts(), getAllProject()])
    return [
      ...listOf(devto).map((post): [string, string] => [`/blog/${post.slug}`, post.title]),
      ...listOf(onsite).map((post): [string, string] => [`/blog/onsite/${post.slug}`, post.title]),
      ...listOf(projects).map((project): [string, string] => [`/project/${project.id}`, project.title]),
    ]
  },
  ["stats-article-titles"],
  { revalidate: 3600 },
)

async function mostRead(reads: Map<string, number>) {
  const candidates = [...reads].filter(([path, n]) => n >= MIN_READERS && ARTICLE_PATH.test(path))
  if (candidates.length === 0) return []
  const titles = new Map(await articleTitles().catch(() => []))
  return candidates
    .filter(([path]) => titles.has(path))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([path, readers]) => ({ path, readers, title: titles.get(path) as string }))
}

function change(delta: number | undefined) {
  if (delta === undefined) return ""
  if (delta === 0) return " The same as the 30 days before."
  return ` ${delta > 0 ? "Up" : "Down"} ${Math.abs(delta).toLocaleString("en")} on the 30 days before.`
}

interface ReadersFiguresProps {
  stats: UmamiStats | null
  daily: UmamiTimeseries
  reads: Map<string, number>
}

/** Umami: the 30-day chart (sticky beside the list from lg), who is here now, and the most read pieces. */
export default async function ReadersFigures({ stats, daily, reads }: Readonly<ReadersFiguresProps>) {
  if (!stats?.pageviews || daily.pageviews.length < 2) return null

  const top = await mostRead(reads)

  return (
    <PageSection
      id="readers"
      heading={{ title: "Readers" }}
      contentClassName={cn("mt-6 grid gap-12", top.length > 0 && "lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]")}
    >
      <div className="lg:sticky lg:top-[calc(var(--head-h)+1rem)] lg:self-start">
        <p className="text-small text-ink-soft">
          Pages read each day over the last 30 days, with sessions dashed.{change(stats.comparison?.pageviews)}
        </p>
        <ReadingNow className="mt-1" />
        <InkChart
          className="mt-4"
          points={daily.pageviews}
          dashed={daily.sessions}
          name="Pages read"
          label="Pages read and sessions each day, the last 30 days"
        />
      </div>

      {top.length > 0 && (
        <div>
          <h3 className="font-display text-h3 text-ink">Most read</h3>
          <LedgerList className="mt-3">
            {top.map(({ path, readers, title }) => (
              <LedgerRow key={path} href={path} title={title} titleAs="h4" meta={`${readers.toLocaleString("en")} readers`} />
            ))}
          </LedgerList>
        </div>
      )}
    </PageSection>
  )
}
