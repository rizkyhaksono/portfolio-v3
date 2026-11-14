import { FileText, Rss } from "lucide-react"
import { SectionIcon } from "@/components/layout/section-icons"
import { StatusLine } from "@/components/ui/status-line"
import { InkLink } from "@/components/ui/ink-link"
import { LedgerList, LedgerRow } from "@/components/ui/ledger"
import { Gallery, MediaCard } from "@/components/ui/media-card"
import { PageHeader } from "@/components/ui/page-header"
import { ReaderCount } from "@/components/ui/reader-count"
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
  // Notion's gallery for the newest posts that have a cover; everything else in the list view below.
  const latest = posts.slice(0, 3).filter((post) => post.image)
  const rest = posts.filter((post) => !latest.includes(post))

  return (
    <div>
      <PageHeader
        icon={<SectionIcon href="/blog" />}
        title="Writing"
        description={posts.length > 0 ? sourcesSentence(posts) : undefined}
      >
        {/* Plain anchor: a feed is not a page, so no client navigation or prefetch. */}
        <a
          href="/feed.xml"
          data-track="rss-subscribe"
          data-track-feed="blog"
          className="-mx-1.5 inline-flex min-h-11 items-center gap-1.5 rounded-md px-1.5 text-small text-muted-foreground transition-colors duration-ui ease-out hover:bg-tint hover:text-foreground md:min-h-8"
        >
          <Rss aria-hidden className="size-4" strokeWidth={1.5} />
          Subscribe by RSS
        </a>
      </PageHeader>

      {posts.length > 0 ? (
        <>
          {latest.length > 0 && (
            <section aria-labelledby="latest" className="mb-10">
              <h2 id="latest" className="mb-2 text-small font-medium text-muted-foreground">
                Latest
              </h2>
              <Gallery>
                {latest.map((post, index) => (
                  // The listener reads the nearest data-track, so the card reports like the rows below.
                  <li key={post.id} data-track="blog-open" data-track-source={post.source}>
                    <MediaCard
                      href={post.href}
                      image={post.image}
                      title={post.title}
                      description={post.excerpt}
                      meta={
                        <>
                          {post.date && <time dateTime={post.date.toISOString()}>{formatDay(post.date)}</time>}
                          {post.source === "medium" ? (
                            <p className="w-full">Published on Medium.</p>
                          ) : (
                            <ReaderCount path={post.href} reads={reads} className="w-full" />
                          )}
                        </>
                      }
                      external={post.source === "medium"}
                      priority={index === 0}
                      sizes="(min-width: 1024px) 15rem, 50vw"
                    />
                  </li>
                ))}
              </Gallery>
            </section>
          )}

          {[...byYear(rest)].map(([year, rows]) => (
            <LedgerList key={year} marker={<h2>{year}</h2>}>
              {rows.map((post) => (
                <LedgerRow
                  key={post.id}
                  icon={<FileText />}
                  title={post.title}
                  href={post.href}
                  external={post.source === "medium"}
                  event="blog-open"
                  eventData={{ source: post.source }}
                  meta={post.date && <time dateTime={post.date.toISOString()}>{formatDayMonth(post.date)}</time>}
                >
                  {post.excerpt && <p className="line-clamp-1">{post.excerpt}</p>}
                  {post.source === "medium" ? (
                    <p className="text-caption">Published on Medium.</p>
                  ) : (
                    <ReaderCount path={post.href} reads={reads} />
                  )}
                </LedgerRow>
              ))}
            </LedgerList>
          ))}
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
