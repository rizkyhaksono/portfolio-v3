import { Suspense } from "react"

import { ToolCabinet, ToolShell } from "./_components/tool-shell"

// Static: the open tool comes from `?tab=` on the client, so the page itself reads no request data.
export default function ToolsPage() {
  return (
    <div>
      <header className="pb-8">
        <h1 className="text-h1 text-balance text-foreground">Tools</h1>
      </header>
      <div aria-hidden className="border-t border-foreground" />

      <Suspense fallback={<ToolCabinet tab={null} />}>
        <ToolShell />
      </Suspense>
    </div>
  )
}
