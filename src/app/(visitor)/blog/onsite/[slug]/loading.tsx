import { CalendarDays, Clock, Globe } from "lucide-react"
import { ArticleLoading } from "@/components/ui/page-loading"

/** Shown while a post from this site loads (without it the writing index skeleton stood in). */
export default function Loading() {
  return (
    <ArticleLoading
      label="Loading the article…"
      cover="aspect-video"
      properties={[
        { label: "Published", icon: <CalendarDays /> },
        { label: "Reading time", icon: <Clock /> },
        { label: "Source", icon: <Globe /> },
      ]}
    />
  )
}
