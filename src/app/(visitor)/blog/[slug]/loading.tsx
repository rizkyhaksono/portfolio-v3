import { CalendarDays, Clock, Globe, MessageSquare } from "lucide-react"
import { ArticleLoading } from "@/components/ui/page-loading"

/** Shown while a DEV article loads: the cover, title and the properties every DEV post has. */
export default function Loading() {
  return (
    <ArticleLoading
      label="Loading the article…"
      cover="aspect-[1000/420]"
      properties={[
        { label: "Published", icon: <CalendarDays /> },
        { label: "Reading time", icon: <Clock /> },
        { label: "Source", icon: <Globe /> },
        { label: "Comments", icon: <MessageSquare /> },
      ]}
    />
  )
}
