import { cookies } from "next/headers"
import { requireAdminPage } from "@/lib/admin-page"
import { StatStrip } from "@/components/ui/stat-strip"
import { LedgerList, LedgerRow } from "@/components/ui/ledger"
import { InkLink } from "@/components/ui/ink-link"
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

  const [today, week, here, feedback, posts, reads] = await Promise.all([
    getUmamiStats(todayStart, end),
    getUmamiStats(end - 7 * DAY, end),
    getActiveVisitors(),
    apiGet<{ total: number }>("/v3/feedback?status=new&limit=1"),
    apiGet<BlogPost[]>("/v3/blog/"),
    getPathReads(),
  ])

  const drafts = (posts ?? []).filter((post) => !post.published)
  const mostRead = [...reads]
    .filter(([path]) => ARTICLE_PATH.test(path))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div className="w-full max-w-[60rem]">
      <StatStrip
        items={[
          { label: "Views today", value: figure(today?.pageviews) },
          { label: "Visitors, last 7 days", value: figure(week?.visitors) },
          { label: "Here now", value: figure(here) },
          { label: "New feedback", value: figure(feedback?.total) },
        ]}
      />
      <p className="mt-3 font-display text-caption text-ink-soft">
        Figures from Umami, refreshed every five minutes. A dash means the source did not answer.
      </p>

      <section className="mt-12">
        <h2 className="font-display text-h3 text-ink">Drafts</h2>
        {posts === null ? (
          <p className="mt-3 text-small text-ink-soft">The blog API did not answer, so drafts are unknown.</p>
        ) : drafts.length === 0 ? (
          <p className="mt-3 text-small text-ink-soft">No drafts. Every post is published.</p>
        ) : (
          <LedgerList className="mt-3">
            {drafts.map((post) => (
              <LedgerRow
                key={post.id}
                href="/admin/dashboard/blog"
                title={post.title}
                titleAs="p"
                meta={post.updated_at ? `Edited ${formatDay(post.updated_at)}` : undefined}
              />
            ))}
          </LedgerList>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-h3 text-ink">Most read</h2>
        <p className="mt-1 font-display text-caption text-ink-soft">Posts and projects, by readers in the last 30 days.</p>
        {mostRead.length === 0 ? (
          <p className="mt-3 text-small text-ink-soft">No readers recorded yet.</p>
        ) : (
          <LedgerList className="mt-3">
            {mostRead.map(([path, readers]) => (
              <LedgerRow key={path} href={path} title={path} titleAs="p" meta={`${readers.toLocaleString("en")} readers`} />
            ))}
          </LedgerList>
        )}
      </section>

      <p className="mt-10 text-body">
        <InkLink href="/admin/dashboard/analytics">All the figures in Analytics</InkLink>
        {feedback?.total ? (
          <>
            {" "}
            or <InkLink href="/admin/dashboard/feedback">read the new feedback</InkLink>
          </>
        ) : null}
        .
      </p>
    </div>
  )
}
