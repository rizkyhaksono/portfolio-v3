"use client"

import { Collection } from "../_components/collection"
import { SourceTabs } from "../_components/source-tabs"
import { backendProjects, supabaseProjects } from "../_components/sources"

export default function AdminProjectPage() {
  return (
    <SourceTabs
      tabs={[
        { id: "supabase", label: "On the site", content: <Collection {...supabaseProjects} /> },
        { id: "legacy", label: "Legacy API", content: <Collection {...backendProjects} /> },
      ]}
    />
  )
}
