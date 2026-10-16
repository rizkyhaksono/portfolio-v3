import { unstable_cache } from "next/cache"
import { PageSection } from "@/components/ui/page-section"
import { LedgerList, LedgerRow } from "@/components/ui/ledger"
import { InkChart } from "@/components/ui/ink-chart"
import { InkLink } from "@/components/ui/ink-link"
import { ReadingNow } from "@/components/ui/reading-now"
import { getDailyPageviews, getPathReads, getUmamiStats } from "@/services/visitor/umami"
import { getBlogData } from "@/services/visitor/blog"
import { getOnsiteBlogPosts } from "@/services/visitor/onsite-blog"
import { getAllProject } from "@/services/visitor/project"
import { DEFERRED_SECTION } from "../deferred"

const MIN_READERS = 10
const ARTICLE_PATH = /^\/(blog|project)\/./

const listOf = <T,>(result: PromiseSettledResult<T[] | null | undefined>) =>
  result.status === "fulfilled" ? (result.value ?? []) : []

// Inside unstable_cache the source fetches (DEV is revalidate 60, onsite no-store) neither lower the page's
// ISR window nor make it dynamic; titles change rarely, so one lookup an hour.
const articleTitles = unstable_cache(
  async (): Promise<[string, string][]> => {
    const [devto, onsite, projects] = await Promise.allSettled([getBlogData(), getOnsiteBlogPosts(), getAllProject()])
    return [
      ...listOf(devto).map((post): [string, string] => [`/blog/${post.slug}`, post.title]),
      ...listOf(onsite).map((post): [string, string] => [`/blog/onsite/${post.slug}`, post.title]),
      ...listOf(projects).map((project): [string, string] => [`/project/${project.id}`, project.title]),
    ]
  },
  ["home-article-titles"],
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
  if (delta === undefined) return null
  if (delta === 0) return "The same as the 30 days before."
  return `${delta > 0 ? "Up" : "Down"} ${Math.abs(delta).toLocaleString("en")} on the 30 days before.`
}

/** Umami figures: 30-day pageviews and change, who is here now, a sparkline and the most read pieces. */
export default async function ReadersSection() {
  const [statsResult, dailyResult, readsResult] = await Promise.allSettled([getUmamiStats(), getDailyPageviews(30), getPathReads()])
  const stats = statsResult.status === "fulfilled" ? statsResult.value : null
  const daily = dailyResult.status === "fulfilled" ? dailyResult.value.pageviews : []
  const views = stats?.pageviews ?? 0
  if (views === 0) return null

  const top = readsResult.status === "fulfilled" ? await mostRead(readsResult.value) : []

  return (
    <PageSection id="readers" heading={{ title: "Readers" }} className={DEFERRED_SECTION} contentClassName="mt-6">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:items-end md:gap-12">
        <div>
          <p className="speckle font-display text-numeral tabular-nums text-ink">{views.toLocaleString("en")}</p>
          <p className="mt-2 text-small text-ink-soft">
            Pages read in the last 30 days. {change(stats?.comparison?.pageviews)}
          </p>
          <ReadingNow className="mt-1" />
        </div>
        {daily.length > 1 && <InkChart points={daily} compact height={72} label="Daily pageviews, last 30 days" />}
      </div>

      {top.length > 0 && (
        <>
          <h3 className="mt-12 font-display text-h3 text-ink">Most read</h3>
          <LedgerList className="mt-3">
            {top.map(({ path, readers, title }) => (
              <LedgerRow key={path} href={path} title={title} titleAs="h4" meta={`${readers.toLocaleString("en")} readers`} />
            ))}
          </LedgerList>
        </>
      )}

      <p className="mt-6 text-body">
        <InkLink href="/stats" className="inline-flex min-h-11 items-center md:min-h-0">More figures on the stats page</InkLink>
      </p>
    </PageSection>
  )
}
