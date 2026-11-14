"use client"

import { PageHeader } from "@/components/ui/page-header"
import { AdminPageIcon } from "@/components/layout/admin/admin-spine"
import { Collection } from "../_components/collection"
import { SourceTabs } from "../_components/source-tabs"
import { backendWork, supabaseCareer } from "../_components/sources"

export default function AdminWorkPage() {
  return (
    <>
      <PageHeader icon={<AdminPageIcon href="/admin/dashboard/work" />} title="Work experience" description="The roles in the Work experience table on the home page." />
      <SourceTabs
        tabs={[
          { id: "supabase", label: "On the site", content: <Collection {...supabaseCareer} /> },
          { id: "legacy", label: "Legacy API", content: <Collection {...backendWork} /> },
        ]}
      />
    </>
  )
}
