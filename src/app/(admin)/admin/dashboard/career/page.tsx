"use client"

import { PageHeader } from "@/components/ui/page-header"
import { AdminPageIcon } from "@/components/layout/admin/admin-spine"
import { Collection } from "../_components/collection"
import { supabaseCareer } from "../_components/sources"

export default function AdminCareerPage() {
  return (
    <>
      <PageHeader icon={<AdminPageIcon href="/admin/dashboard/career" />} title="Career" description="Roles and companies, newest first." />
      <Collection {...supabaseCareer} />
    </>
  )
}
