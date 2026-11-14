import { PageHeader } from "@/components/ui/page-header"
import { StatusLine } from "@/components/ui/status-line"
import { SectionIcon } from "@/components/layout/section-icons"

/** Shown while the certificates load: the same page head as the page, so nothing jumps when it arrives. */
export default function Loading() {
  return (
    <div aria-busy="true">
      <PageHeader icon={<SectionIcon href="/certificates" />} title="Certificates" />
      <StatusLine kind="loading">Loading the certificates…</StatusLine>
    </div>
  )
}
