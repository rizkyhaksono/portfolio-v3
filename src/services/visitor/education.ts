import { getAllFromTable } from "@/lib/supabase-utils";

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
  return getAllFromTable<educationType>("education", "created_at", true);
}