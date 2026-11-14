import { BookOpen, Clock, FileText, ListOrdered, Signal } from "lucide-react"
import { ArticleLoading } from "@/components/ui/page-loading"

/** Shown while a lesson loads: the lesson page in grey, with the property names every lesson has. */
export default function Loading() {
  return (
    <ArticleLoading
      label="Loading the lesson…"

      properties={[
        { label: "Course", icon: <BookOpen /> },
        { label: "Lesson", icon: <ListOrdered /> },
        { label: "Level", icon: <Signal /> },
        { label: "Reading time", icon: <Clock /> },
      ]}
    />
  )
}
