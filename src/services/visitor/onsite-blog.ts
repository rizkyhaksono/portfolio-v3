import { cache } from "react";
import { serverApiUrl } from "@/lib/api-base";

export type OnsiteBlogPost = {
  id: string;
  title: string;
  slug: string;
  description: string;
  /** Only on a single post; the public list leaves the body out. */
  content?: string;
  coverImage?: string | null;
  published?: boolean;
  publishedAt?: string | null;
  created_at: string;
  updated_at?: string;
};

// The list follows /blog's 600 s window (a lower fetch window would lower the page's); one post follows its page's 300 s.
// `cache()` lets the blog index, the feed and the search index share one request per render.
export const getOnsiteBlogPosts = cache(async (): Promise<OnsiteBlogPost[]> => {
  try {
    const response = await fetch(`${serverApiUrl()}/v3/blog?publishedOnly=true`, {
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return [];
    const json = await response.json();
    return json.data ?? [];
  } catch {
    // Backend unreachable (e.g. API down) — degrade gracefully instead of crashing the page.
    return [];
  }
});

/** A published post, or `null` (missing or still a draft: the API's slug route does not filter drafts yet). */
export const getOnsiteBlogBySlug = cache(async (slug: string): Promise<OnsiteBlogPost | null> => {
  try {
    const response = await fetch(`${serverApiUrl()}/v3/blog/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return null;
    const post: OnsiteBlogPost | null = (await response.json()).data ?? null;
    return post?.published === false ? null : post;
  } catch {
    return null;
  }
});
