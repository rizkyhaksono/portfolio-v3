"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Surface } from "@/components/ui/surface"
import { getFeedbackClient, updateFeedbackStatusClient, type AdminFeedback, type FeedbackStatus } from "@/services/admin/feedback"
import { Loader2, Mail, ExternalLink, Check, Archive, Inbox } from "lucide-react"

const FILTERS: { label: string; value: FeedbackStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "Read", value: "read" },
  { label: "Archived", value: "archived" },
]

export default function FeedbackAdminPage() {
  const [items, setItems] = useState<AdminFeedback[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FeedbackStatus | "all">("all")

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getFeedbackClient(filter === "all" ? undefined : filter)
      setItems(data.items)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load feedback")
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    load()
  }, [load])

  const setStatus = async (id: string, status: FeedbackStatus) => {
    try {
      await updateFeedbackStatusClient(id, status)
      toast.success(`Marked ${status}`)
      setItems((prev) =>
        prev
          .map((f) => (f.id === id ? { ...f, status } : f))
          .filter((f) => filter === "all" || f.status === filter),
      )
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update")
    }
  }

  return (
    <div className="flex flex-col gap-4">

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Button key={f.value} size="sm" variant={filter === f.value ? "default" : "outline"} onClick={() => setFilter(f.value)}>
            {f.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
          <Inbox className="h-8 w-8" />
          <p>No feedback{filter !== "all" ? ` (${filter})` : ""} yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((f) => (
            <Surface key={f.id} variant="solid" padding="compact">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="capitalize">{f.category}</Badge>
                <Badge variant={f.status === "new" ? "default" : "outline"} className="capitalize">{f.status}</Badge>
                <span className="text-xs text-muted-foreground">{new Date(f.createdAt).toLocaleString()}</span>
              </div>
              <p className="whitespace-pre-wrap text-sm">{f.message}</p>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                {f.email && (
                  <a href={`mailto:${f.email}`} className="inline-flex items-center gap-1 hover:text-foreground">
                    <Mail className="h-3 w-3" />
                    {f.email}
                  </a>
                )}
                {f.pageUrl && (
                  <a href={f.pageUrl} className="inline-flex items-center gap-1 hover:text-foreground">
                    <ExternalLink className="h-3 w-3" />
                    {f.pageUrl}
                  </a>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                {f.status !== "read" && (
                  <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setStatus(f.id, "read")}>
                    <Check className="h-3.5 w-3.5" /> Mark read
                  </Button>
                )}
                {f.status !== "archived" && (
                  <Button size="sm" variant="ghost" className="gap-1.5 text-muted-foreground" onClick={() => setStatus(f.id, "archived")}>
                    <Archive className="h-3.5 w-3.5" /> Archive
                  </Button>
                )}
              </div>
            </Surface>
          ))}
        </div>
      )}
    </div>
  )
}
