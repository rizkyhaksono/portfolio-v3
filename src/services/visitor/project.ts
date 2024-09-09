import { supabaseUser } from "../../supabase/server";

type projectType = {
  id: string;
  title: string;
  description: string;
  url: string;
  created_at: string;
  updated_at: string;
  image: string | null;
  source_code: string | null;
};

export const getAllProject = async () => {
  const { data } = await supabaseUser
    .from("projects")
    .select("*")
    .order("created_at", {
      ascending: true
    });

  return data as projectType[];
};