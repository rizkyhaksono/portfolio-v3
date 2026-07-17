import { KanbanSquare } from "lucide-react"
import { getTrackerTasks } from "@/services/visitor/tracker"
import { getProfile } from "@/services/user/profile"
import { SectionHeading } from "@/components/ui/section-heading"
import { MacWindow } from "@/components/ui/mac-window"
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
        backdrop={false}: @hello-pangea/dnd uses position:fixed for drag ghosts;
        backdrop-blur / filter on an ancestor becomes the containing block and offsets the drag.
      */}
      <MacWindow title="~/tracker" backdrop={false} bodyClassName="p-3 sm:p-4">
        <TrackerBoard initialTasks={tasks} currentUserId={currentUserId} isAdmin={isAdmin} />
      </MacWindow>
    </div>
  )
}
