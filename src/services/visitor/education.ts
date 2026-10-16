import { supabaseUser } from "../../supabase/server";

type educationType = {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  created_at: string;
  updated_at: string;
  image: string;
}

export const getAllEducation = async () => {
  const { data } = await supabaseUser
    .from("education")
    .select("*")
    .order("created_at", {
      ascending: true
    })
    .abortSignal(AbortSignal.timeout(4000));

  return data as educationType[];
}