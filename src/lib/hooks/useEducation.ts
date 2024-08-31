import { useEffect, useState } from "react"
import { supabaseUser } from "../supabase/server"

export function useGetEducation() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState<any>(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    async function fetchEducation() {
      try {
        setLoading(true)
        const { data } = await supabaseUser
          .from("education")
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
    fetchEducation()
  }, [])

  return { data, loading, error };
}