import { CalendarDays, Clock, Eye, Globe, MessageSquare, Tag } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Property } from "@/components/ui/properties"
import { formatDay, minutesLabel, toDate } from "./format"
import { MIN_READERS } from "@/components/ui/reader-count"


interface ArticlePropertiesInput {
  published?: string | null
  minutes?: number
  source: React.ReactNode
  /** The comments link; DEV posts only. */
  comments?: React.ReactNode
  path: string
  reads: Map<string, number>
  tags?: string[]
}

/** A post's Notion properties: Published, Reading time, Source, Comments, Readers, Tags. Empty ones are left out. */
export function articleProperties({ published, minutes, source, comments, path, reads, tags = [] }: ArticlePropertiesInput): Property[] {
  const date = toDate(published)
  const readers = reads.get(path) ?? 0
  const items: (Property | false | null | undefined | 0)[] = [
    date && { label: "Published", icon: <CalendarDays aria-hidden />, value: <time dateTime={date.toISOString()}>{formatDay(date)}</time> },
    minutes && { label: "Reading time", icon: <Clock aria-hidden />, value: minutesLabel(minutes) },
    { label: "Source", icon: <Globe aria-hidden />, value: source },
    comments != null && { label: "Comments", icon: <MessageSquare aria-hidden />, value: comments },
    readers >= MIN_READERS && {
      label: "Readers",
      icon: <Eye aria-hidden />,
      value: <span className="tabular-nums">{readers.toLocaleString("en")} in the last 30 days</span>,
    },
    tags.length > 0 && { label: "Tags", icon: <Tag aria-hidden />, value: tags.map((tag) => <Badge key={tag}>{tag}</Badge>) },
  ]
  return items.filter((item): item is Property => Boolean(item))
}
