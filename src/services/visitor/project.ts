import "server-only";

import { cache } from "react";
import { supabaseUser } from "@/supabase/server";

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

/** Newest first. Wrapped in `cache()` so metadata, page and previous / next share one query per request. */
export const getAllProject = cache(async () => {
  const { data } = await supabaseUser
    .from("projects")
    .select("id, title, description, url, source_code, image, created_at, updated_at")
    .order("created_at", {
      ascending: false,
    })
    .abortSignal(AbortSignal.timeout(4000));

  return (data ?? []) as projectType[];
});
