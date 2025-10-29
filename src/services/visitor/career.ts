import { getAllFromTable } from "@/lib/supabase-utils";

type careerType = {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  created_at: string;
  updated_at: string;
  image: string | null;
}

export const getAllCarrer = async () => {
  return getAllFromTable<careerType>("career", "created_at", true);
}