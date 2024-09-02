import { DEVTO_BLOG_API } from "@/app/commons/constants/blog";
import {
  BlogDetailProps,
  BlogItem,
  CommentItemProps
} from "@/app/commons/types/blog";

type BlogParamsProps = {
  params: { content: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
export async function getBlogData(): Promise<BlogItem[]> {
  const response = await fetch(DEVTO_BLOG_API, {
    method: "GET",
    next: {
      revalidate: 60,
    },
  });
  if (response?.status !== 200) return {} as BlogItem[];
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