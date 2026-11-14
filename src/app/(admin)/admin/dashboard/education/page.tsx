"use client"

import { PageHeader } from "@/components/ui/page-header"
import { AdminPageIcon } from "@/components/layout/admin/admin-spine"
import { Collection } from "../_components/collection"
import { SourceTabs } from "../_components/source-tabs"
import { backendEducation, supabaseEducation } from "../_components/sources"

export default function AdminEducationPage() {
  return (
    <>
      <PageHeader icon={<AdminPageIcon href="/admin/dashboard/education" />} title="Education" description="The schools in the Work experience table on the home page." />
      <SourceTabs
        tabs={[
          { id: "supabase", label: "On the site", content: <Collection {...supabaseEducation} /> },
          { id: "legacy", label: "Legacy API", content: <Collection {...backendEducation} /> },
        ]}
      />
    </>
  )
}
