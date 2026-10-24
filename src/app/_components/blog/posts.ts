import { excerpt, toDate } from "@/app/_components/blog/format"
import { getBlogData, getBlogMedium } from "@/services/visitor/blog"
import { getOnsiteBlogPosts } from "@/services/visitor/onsite-blog"

export type Source = "dev" | "medium" | "onsite"

export interface Post {
  id: string
  title: string
  excerpt: string
  image?: string
  href: string
  source: Source
  date: Date | null
}

/** Every source in one list, newest first; undated posts sink to the end. */
export async function getPosts(): Promise<Post[]> {
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
