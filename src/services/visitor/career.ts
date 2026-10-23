import { supabaseUser } from "../../supabase/server";

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
  const { data } = await supabaseUser
    .from("career")
    .select("id, title, subtitle, duration, image, created_at, updated_at")
    .order("created_at", {
      ascending: true
    })
    .abortSignal(AbortSignal.timeout(4000));

  return (data ?? []) as careerType[];
}
