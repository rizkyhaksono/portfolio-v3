import { cookies } from "next/headers"
import { requireAdminPage } from "@/lib/admin-page"
import { StatStrip } from "@/components/ui/stat-strip"
import { LedgerList, LedgerRow } from "@/components/ui/ledger"
import { InkLink } from "@/components/ui/ink-link"
import { PageHeader } from "@/components/ui/page-header"
import { StatusLine } from "@/components/ui/status-line"
import { FileText, LayoutGrid, PenLine } from "lucide-react"
import { getBlogData } from "@/services/visitor/blog"
import { getAllProject } from "@/services/visitor/project"
import { floorTo, getActiveVisitors, getPathReads, getUmamiStats } from "@/services/visitor/umami"
import { formatDay } from "@/components/layout/admin/admin-format"
import type { BlogPost } from "@/services/admin/client-services"

const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const ARTICLE_PATH = /^\/(blog|project)\/./

async function apiGet<T>(path: string): Promise<T | null> {
  const token = (await cookies()).get("NATEE_V3_TOKEN")?.value
  try {
    const res = await fetch(`${process.env.API_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(4000),
    })
    if (!res.ok) return null
    return ((await res.json()) as { data?: T }).data ?? null
  } catch {
    return null
  }
}

const figure = (n: number | null | undefined) => (n == null ? "–" : n.toLocaleString("en"))

/** Today's figures, what needs attention (feedback, drafts) and the most read pieces. */
export default async function AdminDashboardPage() {
  await requireAdminPage()
  // Floor to five minutes so the Umami caches hit; the day starts at midnight in Malang (UTC+7, no DST).
  const end = floorTo(Date.now(), 5 * MINUTE)
  const todayStart = floorTo(end + 7 * HOUR, DAY) - 7 * HOUR

  const [today, week, here, feedback, posts, reads, devto, projects] = await Promise.all([
    getUmamiStats(todayStart, end),
    getUmamiStats(end - 7 * DAY, end),
    getActiveVisitors(),
    apiGet<{ total: number }>("/v3/feedback?status=new&limit=1"),
    apiGet<BlogPost[]>("/v3/blog/"),
    getPathReads(),
    getBlogData().catch(() => []),
    getAllProject().catch(() => null),
  ])

  // Titles for the paths Umami reports; a path with no match keeps showing as itself.
  const titles = new Map<string, string>([
    ...(devto ?? []).map((post): [string, string] => [`/blog/${post.slug}`, post.title]),
    ...(posts ?? []).map((post): [string, string] => [`/blog/onsite/${post.slug}`, post.title]),
    ...(projects ?? []).map((project): [string, string] => [`/project/${project.id}`, project.title]),
  ])

  const drafts = (posts ?? []).filter((post) => !post.published)
  const mostRead = [...reads]
    .filter(([path]) => ARTICLE_PATH.test(path))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <>
      <PageHeader title="Dashboard" description="Today on the site, what waits for you, and what people read." />
      <StatStrip
        items={[
          { label: "Views today", value: figure(today?.pageviews) },
          { label: "Visitors, last 7 days", value: figure(week?.visitors) },
          { label: "Here now", value: figure(here) },
          { label: "New feedback", value: figure(feedback?.total) },
        ]}
      />
      <p className="mt-3 text-caption text-muted-foreground">
        Figures from Umami, refreshed every five minutes. A dash means the source did not answer.{" "}
        <InkLink href="/admin/dashboard/analytics">All the figures</InkLink>
        {feedback?.total ? (
          <>
            {" "}or <InkLink href="/admin/dashboard/feedback">the new feedback</InkLink>
          </>
        ) : null}
        .
      </p>

      <div className="mt-12 grid gap-x-12 gap-y-12 xl:grid-cols-2">
        <section aria-labelledby="drafts">
          <h2 id="drafts" className="text-h2 text-foreground">
            Drafts
          </h2>
          {posts === null ? (
            <StatusLine kind="failed" className="mt-3">
              The blog API did not answer, so drafts are unknown.
            </StatusLine>
          ) : drafts.length === 0 ? (
            <StatusLine kind="empty" className="mt-3">
              No drafts. Every post is published.
            </StatusLine>
          ) : (
            <LedgerList className="mt-3">
              {drafts.map((post) => (
                <LedgerRow
                  key={post.id}
                  href="/admin/dashboard/blog"
                  icon={<FileText />}
                  title={post.title}
                  titleAs="p"
                  meta={post.updated_at ? `Edited ${formatDay(post.updated_at)}` : undefined}
                />
              ))}
            </LedgerList>
          )}
        </section>

        <section aria-labelledby="most-read">
          <h2 id="most-read" className="text-h2 text-foreground">
            Most read
          </h2>
          <p className="mt-1 text-small text-muted-foreground">Posts and projects, by readers in the last 30 days.</p>
          {mostRead.length === 0 ? (
            <StatusLine kind="empty" className="mt-3">
              No readers recorded yet.
            </StatusLine>
          ) : (
            <LedgerList className="mt-3">
              {mostRead.map(([path, readers]) => (
                <LedgerRow
                  key={path}
                  href={path}
                  icon={path.startsWith("/project/") ? <LayoutGrid /> : <PenLine />}
                  title={titles.get(path) ?? path}
                  titleAs="p"
                  meta={`${readers.toLocaleString("en")} readers`}
                >
                  {titles.has(path) && <span className="block truncate">{path}</span>}
                </LedgerRow>
              ))}
            </LedgerList>
          )}
        </section>
      </div>
    </>
  )
}
