import { Suspense } from "react"

import { SectionIcon } from "@/components/layout/section-icons"
import { PageHeader } from "@/components/ui/page-header"
import { ToolCabinet, ToolShell } from "./_components/tool-shell"

// Static: the open tool comes from `?tab=` on the client, so the page itself reads no request data.
export default function ToolsPage() {
  return (
    <>
      <PageHeader icon={<SectionIcon href="/tools" />} title="Tools" description="Small tools for practising Japanese and English, testing your typing speed and looking things up." />

      <Suspense fallback={<ToolCabinet tab={null} />}>
        <ToolShell />
      </Suspense>
    </>
  )
}
