import { StatusLine } from "@/components/ui/status-line"
import { InkLink } from "@/components/ui/ink-link"
import { LedgerList, LedgerRow } from "@/components/ui/ledger"
import { MediaCard } from "@/components/ui/media-card"
import { PageHeader } from "@/components/ui/page-header"
import { ReaderCount } from "@/components/ui/reader-count"
import { SECTION_SPACING } from "@/lib/design-system"
import { formatDay, formatDayMonth, yearOf } from "@/app/_components/blog/format"
import { getPosts, type Post, type Source } from "@/app/_components/blog/posts"
import { getPathReads } from "@/services/visitor/umami"

export const revalidate = 600

const SOURCE_NAMES: Record<Source, string> = { dev: "DEV Community", medium: "Medium", onsite: "this site" }

function byYear(posts: Post[]) {
  const years = new Map<string, Post[]>()
  for (const post of posts) {
    const year = post.date ? yearOf(post.date) : "Undated"
    years.set(year, [...(years.get(year) ?? []), post])
  }
  return years
}

function sourcesSentence(posts: Post[]) {
  const names = [...new Set(posts.map((post) => SOURCE_NAMES[post.source]))]
  const list = names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names.at(-1)}` : names[0]
  return `${posts.length.toLocaleString("en")} ${posts.length === 1 ? "piece" : "pieces"} from ${list}, newest first.`
}

export default async function BlogPage() {
  const [posts, reads] = await Promise.all([getPosts(), getPathReads()])
  const [lead, ...rest] = posts

  return (
    <div>
      <PageHeader
        title="Writing"
        description={
          <>
            {lead && `${sourcesSentence(posts)} `}
            {/* Plain anchor: a feed is not a page, so no client navigation or prefetch. */}
            <a
              href="/feed.xml"
              data-track="rss-subscribe"
              data-track-feed="blog"
              className="relative text-foreground underline decoration-foreground/25 decoration-1 underline-offset-4 transition-[text-decoration-color] duration-ui ease-out after:absolute after:-inset-3 hover:decoration-foreground"
            >
              Subscribe by RSS
            </a>
            .
          </>
        }
      />

      {lead ? (
        <>
          <section aria-labelledby="latest">
            <h2 id="latest" className="sr-only">
              Latest
            </h2>
            {/* The listener reads the nearest data-track, so the card reports like the rows below. */}
            <div data-track="blog-open" data-track-source={lead.source}>
              <MediaCard
                href={lead.href}
                image={lead.image}
                title={lead.title}
                description={lead.excerpt}
                meta={lead.date && <time dateTime={lead.date.toISOString()}>{formatDay(lead.date)}</time>}
                external={lead.source === "medium"}
                priority
              />
            </div>
            {lead.source === "medium" ? (
              <p className="mt-1 text-caption text-muted-foreground">Published on Medium.</p>
            ) : (
              <ReaderCount path={lead.href} reads={reads} className="mt-1" />
            )}
          </section>

          {rest.length > 0 && (
            <div className={SECTION_SPACING.section}>
              {[...byYear(rest)].map(([year, rows]) => (
                <LedgerList key={year} marker={<h2>{year}</h2>}>
                  {rows.map((post) => (
                    <LedgerRow
                      key={post.id}
                      title={post.title}
                      href={post.href}
                      external={post.source === "medium"}
                      event="blog-open"
                      eventData={{ source: post.source }}
                      meta={post.date && <time dateTime={post.date.toISOString()}>{formatDayMonth(post.date)}</time>}
                    >
                      {post.excerpt && <p className="line-clamp-2">{post.excerpt}</p>}
                      {post.source === "medium" ? (
                        <p className="mt-1 text-caption">Published on Medium.</p>
                      ) : (
                        <ReaderCount path={post.href} reads={reads} className="mt-1" />
                      )}
                    </LedgerRow>
                  ))}
                </LedgerList>
              ))}
            </div>
          )}
        </>
      ) : (
        <StatusLine kind="failed">
          No writing could be fetched just now. Try again in a few minutes, or read it on{" "}
          <span className="whitespace-nowrap">
            <InkLink href="https://dev.to/rizkyhaksono" external>
              DEV Community
            </InkLink>
            .
          </span>
        </StatusLine>
      )}
    </div>
  )
}
