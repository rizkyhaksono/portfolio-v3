import type { ReactNode } from "react"
import { Gallery } from "@/components/ui/media-card"
import { PageHeader } from "@/components/ui/page-header"
import { Properties } from "@/components/ui/properties"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/**
 * A soft fade for the part of a page that replaces its skeleton (never the head, which the skeleton already shows).
 * `motion-safe`, so reduced motion shows the content at once and leaves no running animation.
 */
export const FADE_IN = "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:duration-300 motion-safe:ease-out"

/** Below 360px two gallery cards are too narrow to read, so a phone that small gets one column. */
export const GALLERY_NARROW = "max-[359px]:grid-cols-1"

/** A grey bar sized to one line of text: `line` is the text's line height, `bar` the bar's width and height. */
function Line({ line = "h-6", bar }: Readonly<{ line?: string; bar: string }>) {
  return (
    <div className={cn("flex items-center", line)}>
      <Skeleton className={bar} />
    </div>
  )
}

/** The one line screen readers hear while the grey shapes stand in. */
export function LoadingStatus({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <p role="status" className="sr-only">
      {children}
    </p>
  )
}

interface PageLoadingProps {
  /** Read out to screen readers, for example "Loading the posts…". */
  label: string
  /** The route's own h1, so the head is in place before the data arrives. */
  title: string
  /** Fixed text shows as is; `true` stands in a grey line for a description that comes with the data. */
  description?: string | true
  /** What sits under the title on the real page (a feed link, properties). */
  headerExtra?: ReactNode
  /** The page body in its real shapes; a few grey lines when left out. */
  children?: ReactNode
  className?: string
}

/** A route's `loading.tsx` as a Notion page: the real title, then grey blocks in the page's own shapes. */
export function PageLoading({ label, title, description, headerExtra, children, className }: Readonly<PageLoadingProps>) {
  return (
    <div aria-busy="true" className={className}>
      <PageHeader
        title={title}
        description={
          description === true ? (
            <span aria-hidden className="inline-block h-4 w-72 max-w-full rounded-md bg-tint align-middle motion-safe:animate-pulse" />
          ) : (
            description
          )
        }
      >
        {headerExtra}
      </PageHeader>
      <LoadingStatus>{label}</LoadingStatus>
      <div aria-hidden>{children ?? <TextSkeleton />}</div>
    </div>
  )
}

const TEXT_WIDTHS = ["w-full", "w-11/12", "w-full", "w-4/5", "w-2/3"]

/** Paragraph lines at the prose line height. */
export function TextSkeleton({ lines = 5, className }: Readonly<{ lines?: number; className?: string }>) {
  return (
    <div className={className}>
      {Array.from({ length: lines }, (_, i) => (
        <Line key={i} line="h-[1.625rem]" bar={cn("h-4", TEXT_WIDTHS[i % TEXT_WIDTHS.length])} />
      ))}
    </div>
  )
}

/** A Notion group label (a year, "Latest") with its count, as on the gallery, list and table views. */
export function GroupLabelSkeleton({ className }: Readonly<{ className?: string }>) {
  return <Line line={cn("mb-2 h-5", className)} bar="h-3.5 w-16" />
}

/** `MediaCard`s in a `Gallery`: the picture on the grey ground, the title, two lines and a property. */
export function GallerySkeleton({ cards = 6, className }: Readonly<{ cards?: number; className?: string }>) {
  return (
    <Gallery className={cn(GALLERY_NARROW, className)}>
      {Array.from({ length: cards }, (_, i) => (
        <li key={i} className="overflow-hidden rounded-lg border border-border">
          <Skeleton className="aspect-[16/10] rounded-none border-b border-border" />
          <div className="px-2.5 pb-2.5 pt-2">
            <Line line="h-5" bar="h-3.5 w-3/4" />
            <Line line="mt-0.5 h-5" bar="h-3 w-full" />
            <Line line="h-5" bar="h-3 w-2/3" />
            <Line line="mt-1.5 h-4" bar="h-3 w-1/3" />
          </div>
        </li>
      ))}
    </Gallery>
  )
}

const ROW_WIDTHS = ["w-3/4", "w-1/2", "w-2/3", "w-3/5", "w-4/5", "w-1/2"]

/** `LedgerRow`s: a 16px icon dot, the title, a muted line, and the meta on the right from `sm`. */
export function ListSkeleton({ rows = 5, className }: Readonly<{ rows?: number; className?: string }>) {
  return (
    <ul role="list" className={className}>
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="-mx-2 flex gap-2.5 px-2 py-1.5">
          <Skeleton className="mt-1 size-4 shrink-0 rounded" />
          <div className="grid min-w-0 flex-1 gap-x-6 sm:grid-cols-[minmax(0,1fr)_auto]">
            <div className="min-w-0">
              <Line bar={cn("h-4", ROW_WIDTHS[i % ROW_WIDTHS.length])} />
              <Line line="h-5" bar="h-3 w-5/6" />
            </div>
            <Line line="h-5 sm:pt-0.5" bar="h-3 w-20" />
          </div>
        </li>
      ))}
    </ul>
  )
}

interface ArticleLoadingProps {
  label: string
  /** The cover picture's shape, when the article usually has one ("aspect-[16/10]"). */
  cover?: string
  /** Property names the article always shows, with their icons; the values stand in as grey bars. */
  properties?: { label: string; icon: ReactNode }[]
}

/** `ArticleShell` in grey: cover, title, standfirst, property rows, the hairline, then the text. */
export function ArticleLoading({ label, cover, properties = [] }: Readonly<ArticleLoadingProps>) {
  return (
    <div aria-busy="true">
      <LoadingStatus>{label}</LoadingStatus>
      <div aria-hidden>
        {cover && <Skeleton className={cn("mb-10 w-full rounded-lg", cover)} />}
        <div className="border-b border-border pb-6">
          <Line line="h-10 sm:h-12" bar="h-8 w-11/12 sm:h-9" />
          <Line line="h-10 sm:h-12" bar="h-8 w-1/2 sm:h-9" />
          <Line line="mt-3 h-6" bar="h-4 w-4/5" />
          {properties.length > 0 && (
            <Properties
              className="mt-5"
              items={properties.map((property, i) => ({ ...property, value: <Skeleton className={cn("h-3.5", ["w-28", "w-20", "w-24", "w-16"][i % 4])} /> }))}
            />
          )}
        </div>
        <TextSkeleton lines={8} className="mt-8" />
      </div>
    </div>
  )
}

export default PageLoading
