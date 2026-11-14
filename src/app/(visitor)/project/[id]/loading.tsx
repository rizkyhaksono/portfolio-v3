import { CalendarPlus, Link2 } from "lucide-react"
import { ArticleLoading } from "@/components/ui/page-loading"

/** Shown while a project loads: the screenshot cover, the title and its Added and Links properties. */
export default function Loading() {
  return (
    <ArticleLoading
      label="Loading the project…"
      cover="aspect-[16/10]"
      properties={[
        { label: "Added", icon: <CalendarPlus strokeWidth={1.5} /> },
        { label: "Links", icon: <Link2 strokeWidth={1.5} /> },
      ]}
    />
  )
}
