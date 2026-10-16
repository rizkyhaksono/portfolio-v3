import Link from "next/link"

import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PagerProps {
  page: number
  totalPages: number
  /** Server pages: the URL of each page (links work without JS). */
  hrefFor?: (page: number) => string
  /** Client islands: change page in state. */
  onPage?: (page: number) => void
  loading?: boolean
  className?: string
}

const STEP = buttonVariants({ variant: "outline", size: "sm" })

/** Previous / Next with "Page n of m" between. Renders nothing for a single page. */
export function Pager({ page, totalPages, hrefFor, onPage, loading, className }: Readonly<PagerProps>) {
  if (totalPages <= 1) return null

  const step = (to: number, label: string, rel: "prev" | "next") => {
    const outOfRange = to < 1 || to > totalPages
    if (!hrefFor) {
      return (
        <Button variant="outline" size="sm" disabled={outOfRange || loading} onClick={() => onPage?.(to)}>
          {label}
        </Button>
      )
    }
    if (outOfRange) {
      return (
        <span aria-disabled="true" className={cn(STEP, "opacity-50")}>
          {label}
        </span>
      )
    }
    return (
      <Link href={hrefFor(to)} rel={rel} className={STEP}>
        {label}
      </Link>
    )
  }

  return (
    <nav aria-label="Pagination" aria-busy={loading || undefined} className={cn("flex items-center justify-between gap-4 border-t border-rule pt-4", className)}>
      {step(page - 1, "Previous", "prev")}
      <p className="font-display text-caption tabular-nums text-ink-soft">
        Page {page} of {totalPages}
      </p>
      {step(page + 1, "Next", "next")}
    </nav>
  )
}

export default Pager
