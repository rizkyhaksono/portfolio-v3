import { Feed } from "feed";
import { getAllChangelogs } from "@/lib/mdx";
import { MetadataConstants } from "@/commons/constants/metadata";
import { authors } from "@/commons/constants/author";

export const revalidate = 3600;

function getBaseUrl(): string {
  const raw = process.env.DOMAIN ?? "https://www.natee.my.id";
  return raw.replace(/\/$/, "");
}

export function GET() {
  const base = getBaseUrl();
  const author = authors.rizky;

  const feed = new Feed({
    title: "Rizky Haksono — Changelog",
    description: "Release notes and platform updates",
    id: `${base}/changelog`,
    link: `${base}/changelog`,
    language: "en",
    favicon: `${base}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${author.name}`,
    feedLinks: {
      rss2: `${base}/changelog.xml`,
    },
    author: {
      name: author.name,
      link: base,
    },
  });

  const entries = getAllChangelogs();

  for (const entry of entries) {
    feed.addItem({
      title: `${entry.meta.title} (v${entry.meta.version})`,
      id: `${base}/changelog/${entry.slug}`,
      link: `${base}/changelog/${entry.slug}`,
      description: entry.meta.description ?? entry.meta.title,
      content: entry.content,
      author: [{ name: entry.meta.author ?? author.name, link: base }],
      date: new Date(entry.meta.date),
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
