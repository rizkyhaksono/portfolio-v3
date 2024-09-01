import { supabaseUser } from "../supabase/server";

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