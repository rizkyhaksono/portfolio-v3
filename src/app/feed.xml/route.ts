import { Feed } from "feed";
import { getBlogData } from "@/services/visitor/blog";
import { getOnsiteBlogPosts } from "@/services/visitor/onsite-blog";
import { MetadataConstants } from "@/commons/constants/metadata";
import { authors } from "@/commons/constants/author";
import { getSiteUrl } from "@/lib/site-url";

export const revalidate = 3600;

const UTM = "utm_source=rss&utm_medium=feed&utm_campaign=blog";

export async function GET() {
  const base = getSiteUrl();
  const author = authors.rizky;

  const feed = new Feed({
    title: "Rizky Haksono — Blog",
    description: MetadataConstants.description,
    id: `${base}/`,
    link: `${base}/blog`,
    language: "en",
    image: MetadataConstants.profile,
    favicon: `${base}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${author.name}`,
    feedLinks: {
      rss2: `${base}/feed.xml`,
    },
    author: {
      name: author.name,
      link: base,
    },
  });

  const [dev, onsite] = await Promise.all([getBlogData(), getOnsiteBlogPosts()]);
  // Summaries only: readers follow the link (with UTM) to the article, never raw markdown in the feed.
  const items = [
    ...dev
      .filter((post) => post.slug)
      .map((post) => ({
        path: `/blog/${post.slug}`,
        title: post.title,
        description: post.description,
        date: post.published_at || post.created_at,
        image: post.cover_image,
        tags: post.tag_list ?? [],
      })),
    ...onsite.map((post) => ({
      path: `/blog/onsite/${post.slug}`,
      title: post.title,
      description: post.description,
      date: post.publishedAt || post.created_at,
      image: post.coverImage,
      tags: [] as string[],
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  for (const item of items) {
    feed.addItem({
      title: item.title,
      id: `${base}${item.path}`,
      link: `${base}${item.path}?${UTM}`,
      description: item.description,
      author: [{ name: author.name, link: base }],
      date: new Date(item.date),
      // feed prints the enclosure URL into an attribute without escaping it.
      image: item.image ? new URL(item.image, base).href.replaceAll("&", "&amp;") : undefined,
      category: item.tags.map((name) => ({ name })),
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
