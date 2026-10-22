import Image from "next/image"
import { isSiteImage } from "@/lib/site-url"
import { canOptimizeImage } from "@/lib/image-hosts"
import { InkLink } from "@/components/ui/ink-link"
import { LedgerList, LedgerRow } from "@/components/ui/ledger"
import { PlateFigure } from "@/components/ui/plate-figure"
import { ReaderCount } from "@/components/ui/reader-count"
import { excerpt, formatDay, formatDayMonth, toDate, yearOf } from "@/app/_components/blog/format"
import { getBlogData, getBlogMedium } from "@/services/visitor/blog"
import { getOnsiteBlogPosts } from "@/services/visitor/onsite-blog"
import { getPathReads } from "@/services/visitor/umami"

export const revalidate = 600

type Source = "dev" | "medium" | "onsite"

interface Post {
  id: string
  title: string
  excerpt: string
  image?: string
  href: string
  source: Source
  date: Date | null
}

const SOURCE_NAMES: Record<Source, string> = { dev: "DEV Community", medium: "Medium", onsite: "this site" }

/** Every source in one list, newest first; undated posts sink to the end. */
async function getPosts(): Promise<Post[]> {
  const [dev, medium, onsite] = await Promise.all([getBlogData(), getBlogMedium(), getOnsiteBlogPosts()])
  const posts: Post[] = [
    ...dev.map((post) => ({
      id: `dev-${post.id}`,
      title: post.title,
      excerpt: excerpt(post.description ?? ""),
      image: post.cover_image || undefined,
      href: `/blog/${post.slug}`,
      source: "dev" as const,
      date: toDate(post.published_at || post.created_at),
    })),
    ...medium.map((post) => ({
      id: `medium-${post.guid}`,
      title: post.title,
      excerpt: excerpt(post.description ?? ""),
      image: post.thumbnail || undefined,
      href: post.link,
      source: "medium" as const,
      date: toDate(post.pubDate),
    })),
    ...onsite.map((post) => ({
      id: `onsite-${post.id}`,
      title: post.title,
      excerpt: excerpt(post.description ?? ""),
      image: post.coverImage || undefined,
      href: `/blog/onsite/${post.slug}`,
      source: "onsite" as const,
      date: toDate(post.publishedAt || post.created_at),
    })),
  ]
  return posts.sort((a, b) => (b.date?.getTime() ?? 0) - (a.date?.getTime() ?? 0))
}

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
      <header className="pb-8">
        <h1 className="font-display text-h1 text-balance text-ink">Writing</h1>
        <p className="mt-4 text-small text-ink-soft">
          {lead && `${sourcesSentence(posts)} `}
          {/* Plain anchor: a feed is not a page, so no client navigation or prefetch. */}
          <a
            href="/feed.xml"
            data-track="rss-subscribe"
            data-track-feed="blog"
            className="text-ink underline decoration-1 underline-offset-[0.18em] hover:decoration-2"
          >
            Subscribe by RSS
          </a>
          .
        </p>
      </header>
      <div aria-hidden className="border-t border-ink" />

      {lead ? (
        <>
          <article className="grid gap-6 py-10 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:items-end md:gap-10">
            {lead.image && (
              <PlateFigure tone={isSiteImage(lead.image) ? "color" : "photo"}>
                <div className="relative aspect-[1000/420]">
                  <Image src={lead.image} alt="" fill priority unoptimized={!canOptimizeImage(lead.image)} sizes="(min-width: 1216px) 36rem, (min-width: 768px) 52vw, 100vw" className="object-cover" />
                </div>
              </PlateFigure>
            )}
            <div className={lead.image ? undefined : "md:col-span-2"}>
              <p className="font-display text-caption text-ink-soft">
                The latest{lead.date && <>, published <time dateTime={lead.date.toISOString()}>{formatDay(lead.date)}</time></>}
                {lead.source === "medium" ? " on Medium." : "."}
              </p>
              <h2 className="mt-2 font-display text-h2 text-balance text-ink">
                <InkLink href={lead.href} external={lead.source === "medium"} event="blog-open" eventData={{ source: lead.source }}>
                  {lead.title}
                </InkLink>
              </h2>
              {lead.excerpt && <p className="mt-3 max-w-[60ch] text-body text-ink-soft">{lead.excerpt}</p>}
              {lead.source !== "medium" && <ReaderCount path={lead.href} reads={reads} className="mt-3" />}
            </div>
          </article>

          {[...byYear(rest)].map(([year, rows]) => (
            <LedgerList key={year} marker={<h2>{year}</h2>} className="mb-10">
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
                  {post.excerpt && <p className="max-w-[60ch]">{post.excerpt}</p>}
                  {post.source === "medium" ? (
                    <p className="mt-1 font-display text-caption">Published on Medium.</p>
                  ) : (
                    <ReaderCount path={post.href} reads={reads} className="mt-1" />
                  )}
                </LedgerRow>
              ))}
            </LedgerList>
          ))}
        </>
      ) : (
        <p className="py-10 font-display text-lead text-ink-soft">
          No writing could be fetched just now. Try again in a few minutes, or read it on{" "}
          <span className="whitespace-nowrap">
            <InkLink href="https://dev.to/rizkyhaksono" external>
              DEV Community
            </InkLink>
            .
          </span>
        </p>
      )}
    </div>
  )
}
