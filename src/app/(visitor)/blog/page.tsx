import CardBlog from "@/app/_components/blog/card-blog"
import BlurFade from "@/components/magicui/blur-fade"
import { getBlogData, getBlogMedium } from "@/services/visitor/blog"
import { getOnsiteBlogPosts, type OnsiteBlogPost } from "@/services/visitor/onsite-blog"
import type { BlogItem } from "@/commons/types/blog"
import { PageBody } from "@/components/ui/page-body"
import { SectionHeading } from "@/components/ui/section-heading"
import { Newspaper } from "lucide-react"

export const dynamic = "force-dynamic"

interface MediumFeedItem {
  guid: string
  title: string
  description: string
  link: string
  pubDate?: string
}

interface UnifiedPost {
  id: string
  title: string
  description: string
  image?: string
  href: string
  source: "DEV.to" | "Medium" | "Portfolio"
  publishedAt: string
  external: boolean
}

/** Extracts the first image URL from Medium's RSS description HTML. */
function extractMediumImage(description: string): string | undefined {
  return /<img.*?src="(.*?)"/.exec(description)?.[1]
}

/** Formats a feed date without introducing client-side hydration work. */
function formatFeedDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(date)
}

/** Converts a feed date into a stable sortable value. */
function toTimestamp(value: string): number {
  const timestamp = new Date(value).getTime()
  return Number.isNaN(timestamp) ? 0 : timestamp
}

/** Normalizes posts from every publishing source into one chronological feed. */
function buildUnifiedFeed(devPosts: BlogItem[], mediumPosts: MediumFeedItem[], onsitePosts: OnsiteBlogPost[]): UnifiedPost[] {
  const dev: UnifiedPost[] = devPosts.map((post) => ({
    id: `dev-${post.id}`,
    title: post.title,
    description: post.description,
    image: post.cover_image || undefined,
    href: `/blog/${post.slug}?id=${post.id}`,
    source: "DEV.to",
    publishedAt: post.published_at || post.created_at,
    external: false,
  }))
  const medium: UnifiedPost[] = mediumPosts.map((post) => ({
    id: `medium-${post.guid}`,
    title: post.title,
    description: post.description,
    image: extractMediumImage(post.description),
    href: post.link,
    source: "Medium",
    publishedAt: post.pubDate || "",
    external: true,
  }))
  const onsite: UnifiedPost[] = onsitePosts.map((post) => ({
    id: `portfolio-${post.id}`,
    title: post.title,
    description: post.description,
    image: post.coverImage || undefined,
    href: `/blog/onsite/${post.slug}`,
    source: "Portfolio",
    publishedAt: post.publishedAt || post.created_at,
    external: false,
  }))

  return [...dev, ...medium, ...onsite].sort((a, b) => toTimestamp(b.publishedAt) - toTimestamp(a.publishedAt))
}

export default async function BlogPage() {
  const [blogs, medium, onsite] = await Promise.all([
    getBlogData(),
    getBlogMedium(),
    getOnsiteBlogPosts(),
  ])
  const posts = buildUnifiedFeed(blogs, (medium?.items ?? []) as MediumFeedItem[], onsite)

  return (
    <BlurFade delay={0.15} inView>
      <PageBody width="article">
      <SectionHeading
        className="mb-8"
        eyebrow={
          <>
            <Newspaper className="h-3.5 w-3.5 text-primary" />
            Writing
          </>
        }
        title="Blog"
        accent="& notes"
        description="Notes from building software, learning in public, and the work behind the finished product."
      />
      <div className="mb-2 flex flex-wrap items-center justify-between gap-3 border-y border-border py-3">
        <p className="text-sm text-muted-foreground">All writing, newest first.</p>
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{posts.length} articles · {new Set(posts.map((post) => post.source)).size} sources</p>
      </div>
      <div className="w-full">
        {posts.map((post) => (
          <CardBlog key={post.id} title={post.title} description={post.description} image={post.image} href={post.href} source={post.source} date={formatFeedDate(post.publishedAt)} external={post.external} />
        ))}
        {posts.length === 0 ? <p className="py-12 text-center text-sm text-muted-foreground">No articles published yet.</p> : null}
      </div>
      </PageBody>
    </BlurFade>
  )
}
