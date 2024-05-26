"use client"

import AdminSidebar from "../components/admin-sidebar"
import { supabaseUser } from "@/lib/supabase/server"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminDashboardCareerPage() {
  const [careerData, setCareerData] = useState<any>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCareer = async () => {
      setIsLoading(true)
      const { data, error } = await supabaseUser.from("career").select("*")
      if (error) {
        console.log(error)
      } else {
        setCareerData(data)
      }
      setIsLoading(false)
    }
    fetchCareer()
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <AdminSidebar />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 mx-4">
          Admin Dashboard Career Page
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AdminSidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 mx-4">
        Admin Dashboard Career Page
        {careerData.map((career: any) => (
          <div key={career.id}>
            <h1>{career.title}</h1>
            <p>{career.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
