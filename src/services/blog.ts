import { DEVTO_BLOG_API } from "@/commons/constants/blog";
import {
  BlogDetailProps,
  BlogItem,
  CommentItemProps,
  BlogParamsProps,
} from "@/commons/types/blog";

export async function getBlogData(): Promise<BlogItem[]> {
  const response = await fetch(DEVTO_BLOG_API, {
    method: "GET",
    headers: {
      "cookie": "ahoy_visitor=28ebdc50-e8d8-4659-b6b5-946b6eed777f; _ga=GA1.1.1669738865.1710733132; client_id=48FU6vOxxI2yo.79d2b073-963f-4a4a-b93e-9e2363637951; remember_user_token=eyJfcmFpbHMiOnsibWVzc2FnZSI6IlcxczVOVFExTURsZExDSnpTR3R2V1hSWlYzTnJYelIzWkhwMlUzTjFReUlzSWpFM01qVXlOekF6TWpFdU1EVTFOek0wTWlKZCIsImV4cCI6IjIwMjUtMDMtMDNUMDk6NDU6MjEuMDU1WiIsInB1ciI6ImNvb2tpZS5yZW1lbWJlcl91c2VyX3Rva2VuIn19--b20faae4b60a7442e99e8f0ebc1469e67448fc14; _Devto_Forem_Session=87bd08a21ec1c97653fa37a530ea2cf7; ahoy_visit=d6b3e335-4f6a-4553-849b-ab59db60b4ef; user_experience_level=3; _ga_TYEM8Y3JN3=GS1.1.1725302267.15.1.1725302969.0.0.0"
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