import {
  BlogDetailProps,
  BlogItem,
  CommentItemProps,
  BlogParamsProps,
} from "@/commons/types/blog";

export async function getBlogData(): Promise<BlogItem[]> {
  const response = await fetch(`https://dev.to/api/articles/me`, {
    method: "GET",
    headers: {
      "api-key": process.env.DEVTO_KEY ?? "",
    },
    next: {
      revalidate: 60,
    },
  });

  if (response?.status !== 200) return [] as BlogItem[];
  return await response.json();
}

export async function getBlogDetail({
  searchParams,
}: BlogParamsProps): Promise<BlogDetailProps> {
  const URL = `https://dev.to/api/articles/${searchParams.id}`;
  const response = await fetch(URL, {
    method: "GET",
    headers: {
      "api-key": process.env.DEVTO_KEY ?? "",
    },
    next: {
      revalidate: 60,
    },
  });
  if (response.status !== 200) return {} as BlogDetailProps;
  return await response.json();
}

export async function getComments(postId: string): Promise<CommentItemProps[]> {
  const DEV_TO_URL = `https://dev.to/api/comments/?a_id=${postId}`;
  const response = await fetch(DEV_TO_URL, {
    headers: {
      "api-key": process.env.DEVTO_KEY ?? "",
    },
  });
  if (response?.status !== 200) return [];
  return await response.json();
}

export async function getBlogViews(searchParams: string) {
  const URL = `https://dev.to/api/articles/me/all`;
  const response = await fetch(URL, {
    headers: {
      "api-key": process.env.DEVTO_KEY ?? "",
    },
  });
  if (response.status !== 200) return 0;
  const data = await response.json();

  const findArticle = data?.find(
    (blog: BlogItem) => blog.id === parseInt(searchParams)
  );
  const page_views_count: number = findArticle?.page_views_count;
  return page_views_count;
}

export async function getBlogMedium() {
  const URL = "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@rizkyhaksono";
  const response = await fetch(URL)
  if (response.status !== 200) return 0;
  return await response.json();
}