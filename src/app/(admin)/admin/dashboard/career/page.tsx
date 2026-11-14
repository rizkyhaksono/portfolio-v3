"use client"

import { PageHeader } from "@/components/ui/page-header"
import { Collection } from "../_components/collection"
import { supabaseCareer } from "../_components/sources"

export default function AdminCareerPage() {
  return (
    <>
      <PageHeader title="Career" description="Roles and companies, newest first." />
      <Collection {...supabaseCareer} />
    </>
  )
}
