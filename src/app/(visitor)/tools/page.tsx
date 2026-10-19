import { Suspense } from "react"

import { ToolCabinet, ToolShell } from "./_components/tool-shell"

// Static: the open tool comes from `?tab=` on the client, so the page itself reads no request data.
export default function ToolsPage() {
  return (
    <div>
      <header className="pb-8">
        <h1 className="font-display text-h1 text-balance text-ink">Tools</h1>
        <p className="mt-4 max-w-[46ch] font-display text-lead text-ink-soft">
          Small things built to learn an API or to practise something: two archives, two language drills, a typing test, a downloader and a few lookups.
        </p>
      </header>
      <div aria-hidden className="h-[5px] border-y border-b-rule border-t-ink" />

      <Suspense fallback={<ToolCabinet tab={null} />}>
        <ToolShell />
      </Suspense>
    </div>
  )
}
