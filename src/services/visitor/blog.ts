import {
  BlogDetailProps,
  BlogItem,
  CommentItemProps,
  BlogParamsProps,
} from "@/commons/types/blog";

const DEVTO_API_BASE = "https://dev.to/api";

/**
 * Generic function to fetch from dev.to API with consistent error handling
 */
async function fetchDevTo<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${DEVTO_API_BASE}${endpoint}`, {
    method: "GET",
    headers: {
      "api-key": process.env.DEVTO_KEY ?? "",
    },
    ...options,
  });

  if (response.status !== 200) {
    // Return appropriate empty values based on expected type
    return (Array.isArray({} as T) ? [] : {}) as T;
  }

  return await response.json();
}

export async function getBlogData(): Promise<BlogItem[]> {
  return fetchDevTo<BlogItem[]>("/articles/me", {
    next: { revalidate: 60 },
  });
}

export async function getBlogDetail({
  searchParams,
}: BlogParamsProps): Promise<BlogDetailProps> {
  return fetchDevTo<BlogDetailProps>(`/articles/${searchParams.id}`, {
    next: { revalidate: 60 },
  });
}

export async function getComments(postId: string): Promise<CommentItemProps[]> {
  return fetchDevTo<CommentItemProps[]>(`/comments/?a_id=${postId}`);
}

export async function getBlogViews(searchParams: string) {
  const data = await fetchDevTo<BlogItem[]>("/articles/me/all");
  
  const findArticle = data?.find(
    (blog: BlogItem) => blog.id === parseInt(searchParams)
  );
  const page_views_count: number = findArticle?.page_views_count ?? 0;
  return page_views_count;
}

export async function getBlogMedium() {
  const URL = "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@rizkyhaksono";
  const response = await fetch(URL)
  if (response.status !== 200) return 0;
  return await response.json();
}