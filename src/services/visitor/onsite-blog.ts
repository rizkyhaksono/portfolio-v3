const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type OnsiteBlogPost = {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  coverImage?: string | null;
  publishedAt?: string | null;
  created_at: string;
};

export async function getOnsiteBlogPosts(): Promise<OnsiteBlogPost[]> {
  try {
    const response = await fetch(`${API_URL}/v3/blog/?publishedOnly=true`, {
      cache: "no-store",
    });
    if (!response.ok) return [];
    const json = await response.json();
    return json.data ?? [];
  } catch {
    // Backend unreachable (e.g. API down) — degrade gracefully instead of crashing the page.
    return [];
  }
}

export async function getOnsiteBlogBySlug(slug: string): Promise<OnsiteBlogPost | null> {
  try {
    const response = await fetch(`${API_URL}/v3/blog/${slug}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    const json = await response.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}
