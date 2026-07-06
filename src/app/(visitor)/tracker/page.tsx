import { KanbanSquare } from "lucide-react"
import { getTrackerTasks } from "@/services/visitor/tracker"
import { getProfile } from "@/services/user/profile"
import { SectionHeading } from "@/components/ui/section-heading"
import TrackerBoard from "./_components/tracker-board"

export const dynamic = "force-dynamic"

export default async function TrackerPage() {
  const [tasks, profile] = await Promise.all([getTrackerTasks(), getProfile().catch(() => null)])
  const currentUserId: string | null = profile?.data?.id ?? null
  const isAdmin = profile?.data?.role === "ADMIN"

  return (
    <div>
      <SectionHeading
        as="h1"
        align="center"
        className="mb-6"
        eyebrow={
          <>
            <KanbanSquare className="h-3.5 w-3.5" />
            Kanban
          </>
        }
        title="Tracker"
        accent="board"
        description="A public Jira-style board — drag cards across columns. Anyone can view; sign in to add & move."
      />

      {/*
        Mac-style window WITHOUT backdrop-filter/transform. @hello-pangea/dnd positions the
        dragged card with `position: fixed`; any ancestor with transform/filter/backdrop-filter
        (BlurFade, MacWindow's backdrop-blur) becomes its containing block and offsets the drag.
      */}
      <div className="rounded-2xl border border-border/60 bg-background/40 shadow-sm">
        <div className="flex items-center gap-3 rounded-t-2xl border-b border-border/60 bg-muted/40 px-4 py-3">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-400/90" />
            <span className="h-3 w-3 rounded-full bg-yellow-400/90" />
            <span className="h-3 w-3 rounded-full bg-green-400/90" />
          </div>
          <p className="flex-1 truncate text-center font-mono text-xs text-muted-foreground">~/tracker</p>
          <div className="w-[46px] shrink-0" aria-hidden />
        </div>
        <div className="p-3 sm:p-4">
          <TrackerBoard initialTasks={tasks} currentUserId={currentUserId} isAdmin={isAdmin} />
        </div>
      </div>
    </div>
  )
}
