import { cn } from "@/lib/utils"

const MIN_READERS = 10

interface ReaderCountProps {
  /** Exact page path, for example `/blog/my-post`. */
  path: string
  /** From `getPathReads()`. */
  reads: Map<string, number>
  className?: string
}

/** "Read by N people in the last 30 days." Hidden below ten readers. */
export function ReaderCount({ path, reads, className }: Readonly<ReaderCountProps>) {
  const readers = reads.get(path.replace(/\/+$/, "") || "/") ?? 0
  if (readers < MIN_READERS) return null

  return (
    <p className={cn("font-display text-caption tabular-nums text-ink-soft", className)}>
      Read by {readers.toLocaleString("en")} people in the last 30 days.
    </p>
  )
}

export default ReaderCount
