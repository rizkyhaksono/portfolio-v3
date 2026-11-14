import { PageLoading } from "@/components/ui/page-loading"

/** Shown while the messages load. */
export default function Loading() {
  return <PageLoading title="Chat">Loading the messages…</PageLoading>
}
