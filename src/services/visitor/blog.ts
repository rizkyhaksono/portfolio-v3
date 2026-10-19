import { cache } from "react";
import type { BlogDetailProps, BlogItem, CommentItemProps } from "@/commons/types/blog";

const DEV_USER = "rizkyhaksono";
const devHeaders = () => ({ "api-key": process.env.DEVTO_KEY ?? "" });

export interface MediumFeedItem {
  guid: string;
  title: string;
  description: string;
  link: string;
  pubDate?: string;
  /** rss2json fills it with the first image of the post. */
  thumbnail?: string;
}

export async function getBlogData(): Promise<BlogItem[]> {
  try {
    const response = await fetch(`https://dev.to/api/articles/me`, {
      headers: devHeaders(),
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(4000),
    });
    if (response.status !== 200) return [];
    return await response.json();
  } catch {
    return [];
  }
}

/**
 * One DEV article by slug, so `/blog/{slug}` needs no `?id`. `null` only when DEV answers 404;
 * any other failure throws, so ISR keeps serving the last good page instead of caching a 404.
 */
export const getBlogDetail = cache(async (slug: string): Promise<BlogDetailProps | null> => {
  const request = () =>
    fetch(`https://dev.to/api/articles/${DEV_USER}/${encodeURIComponent(slug)}`, {
      headers: devHeaders(),
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    });
  let response = await request();
  if (response.status === 429) {
    // The build prerenders every post at once and DEV rate-limits the burst: wait once (Retry-After, at most 5 s).
    const seconds = Math.min(Number(response.headers.get("retry-after")) || 1, 5);
    await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
    response = await request();
  }
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`DEV article ${slug} answered ${response.status}`);
  return response.json();
});

export async function getComments(articleId: number): Promise<CommentItemProps[]> {
  try {
    const response = await fetch(`https://dev.to/api/comments?a_id=${articleId}`, {
      headers: devHeaders(),
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(4000),
    });
    if (response.status !== 200) return [];
    return await response.json();
  } catch {
    return [];
  }
}

export async function getBlogMedium(): Promise<MediumFeedItem[]> {
  try {
    const response = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@rizkyhaksono", {
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(4000),
    });
    if (response.status !== 200) return [];
    const json = await response.json();
    return Array.isArray(json?.items) ? json.items : [];
  } catch {
    return [];
  }
}
