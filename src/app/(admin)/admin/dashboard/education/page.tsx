"use client"

import { Collection } from "../_components/collection"
import { SourceTabs } from "../_components/source-tabs"
import { backendEducation, supabaseEducation } from "../_components/sources"

export default function AdminEducationPage() {
  return (
    <SourceTabs
      tabs={[
        { id: "supabase", label: "On the site", content: <Collection {...supabaseEducation} /> },
        { id: "legacy", label: "Legacy API", content: <Collection {...backendEducation} /> },
      ]}
    />
  )
}
