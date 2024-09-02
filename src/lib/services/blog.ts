import axios, { AxiosError, AxiosResponse } from 'axios';
import { supabaseUser } from "../supabase/server";
import { BlogItemProps } from '../commons/types/blolg';

type BlogParamsProps = {
  page?: number;
  per_page?: number;
  categories: number | undefined;
  search?: string;
};

interface BlogDetailResponseProps {
  status: number;
  data: any;
}

type blogType = {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  content: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

const BLOG_URL = process.env.BLOG_API_URL as string;

export const getAllBlog = async () => {
  const { data } = await supabaseUser
    .from("blogs")
    .select("*")
    .order("created_at", {
      ascending: true
    });

  return data as blogType[];
}

export const getBlogBySlug = async (slug: string) => {
  const { data } = await supabaseUser
    .from("blogs")
    .select("*")
    .eq("slug", slug);

  return data as blogType[];
}

const handleAxiosError = (
  error: AxiosError<any>,
): { status: number; data: any } => {
  if (error?.response) {
    return { status: error?.response?.status, data: error?.response?.data };
  } else {
    return { status: 500, data: { message: 'Internal Server Error' } };
  }
};

const extractData = (
  response: AxiosResponse,
): {
  posts: BlogItemProps[];
  page: number;
  per_page: number;
  total_pages: number;
  total_posts: number;
  categories: number;
} => {
  const { headers, data } = response;
  return {
    posts: data,
    page: response?.config?.params?.page || 1,
    per_page: response?.config?.params?.per_page || 6,
    total_pages: Number(headers['x-wp-totalpages']) || 0,
    total_posts: Number(headers['x-wp-total']) || 0,
    categories: response?.config?.params?.categories,
  };
};

export const getBlogList = async ({
  page = 1,
  per_page = 6,
  categories,
  search,
}: BlogParamsProps): Promise<{ status: number; data: any }> => {
  try {
    const params = { page, per_page, categories, search };
    const response = await axios.get(`${BLOG_URL}posts`, { params });
    return { status: response?.status, data: extractData(response) };
  } catch (error) {
    return handleAxiosError(error as AxiosError<any>);
  }
};

export const getBlogDetail = async (
  id: number,
): Promise<BlogDetailResponseProps> => {
  try {
    const response = await axios.get(`${BLOG_URL}posts/${id}`);
    return { status: response?.status, data: response?.data };
  } catch (error) {
    return handleAxiosError(error as AxiosError<any>);
  }
};