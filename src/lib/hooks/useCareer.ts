"use client"

import { useEffect, useState } from "react"
import { supabaseUser } from "../supabase/server"

export function useGetCareer() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState<any>(true)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    async function fetchCareer() {
      try {
        setLoading(true)
        const { data } = await supabaseUser
          .from("career")
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
    fetchCareer()
  }, [])

  return { data, loading, error };
}