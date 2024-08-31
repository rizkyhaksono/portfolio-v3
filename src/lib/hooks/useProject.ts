import { useEffect, useState } from "react"
import { supabaseUser } from "../supabase/server"

export function useGetProject() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState<any>(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    async function fetchProject() {
      try {
        setLoading(true)
        const { data } = await supabaseUser
          .from("projects")
          .select("*")
          .order("created_at", {
            ascending: true
          });
        setData(data)
      } catch (error) {
        setError(error)
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [])

  return { data, loading, error };
}