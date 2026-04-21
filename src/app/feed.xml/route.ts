import { Feed } from "feed";
import { getBlogData } from "@/services/visitor/blog";
import { MetadataConstants } from "@/commons/constants/metadata";
import { authors } from "@/commons/constants/author";

export const revalidate = 3600;

function getBaseUrl(): string {
  const raw = process.env.DOMAIN ?? "https://www.natee.my.id";
  return raw.replace(/\/$/, "");
}

export async function GET() {
  const base = getBaseUrl();
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

  const posts = await getBlogData().catch(() => []);

  if (Array.isArray(posts)) {
    for (const post of posts) {
      if (!post?.slug) continue;
      feed.addItem({
        title: post.title,
        id: `${base}/blog/${post.slug}`,
        link: `${base}/blog/${post.slug}`,
        description: post.description,
        content: post.body_markdown ?? post.description,
        author: [{ name: post.user?.name ?? author.name, link: base }],
        date: post.published_at ? new Date(post.published_at) : new Date(),
        image: post.cover_image ?? undefined,
        category: (post.tag_list ?? []).map((name) => ({ name })),
      });
    }
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
