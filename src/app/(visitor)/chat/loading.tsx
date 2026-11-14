import { SectionIcon } from "@/components/layout/section-icons"
import { PageHeader } from "@/components/ui/page-header"
import { StatusLine } from "@/components/ui/status-line"

/** Shown while the messages load: the same page head as the room, so nothing jumps when it arrives. */
export default function Loading() {
  return (
    <div aria-busy="true">
      <PageHeader icon={<SectionIcon href="/chat" />} title="Chat" className="mb-6" />
      <StatusLine kind="loading">Loading the messages…</StatusLine>
    </div>
  )
}
