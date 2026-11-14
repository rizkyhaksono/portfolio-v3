"use client"

import { PageHeader } from "@/components/ui/page-header"
import { Collection } from "../_components/collection"
import { SourceTabs } from "../_components/source-tabs"
import { backendProjects, supabaseProjects } from "../_components/sources"

export default function AdminProjectPage() {
  return (
    <>
      <PageHeader title="Projects" description="The projects on /project and the home page." />
      <SourceTabs
        tabs={[
          { id: "supabase", label: "On the site", content: <Collection {...supabaseProjects} /> },
          { id: "legacy", label: "Legacy API", content: <Collection {...backendProjects} /> },
        ]}
      />
    </>
  )
}
