import { useEffect, useState } from "react";
import { supabaseUser } from "../supabase/server";

export function useGetBlog() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchBlog() {
      try {
        setLoading(true);
        const { data } = await supabaseUser
          .from("blogs")
          .select("*")
          .order("created_at", {
            ascending: true
          });
        setData(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, []);

  return { data, loading, error };
}