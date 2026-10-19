import { cookies } from "next/headers"
import { getTrackerTasks } from "@/services/visitor/tracker"
import { getProfile } from "@/services/user/profile"
import { InkLink } from "@/components/ui/ink-link"
import TrackerBoard from "./_components/tracker-board"

export const dynamic = "force-dynamic"

export default async function TrackerPage() {
  // Readers without a session cookie skip the /v3/me round trip.
  const signedIn = (await cookies()).has("NATEE_V3_TOKEN")
  const [tasks, profile] = await Promise.all([getTrackerTasks(), signedIn ? getProfile().catch(() => null) : null])
  const currentUserId: string | null = profile?.data?.id ?? null
  const isAdmin = profile?.data?.role === "ADMIN"
  const done = tasks.filter((t) => t.status === "done").length

  return (
    <div>
      <header className="pb-8">
        <h1 className="font-display text-h1 text-balance text-ink">Tracker</h1>
        <p className="mt-4 max-w-[46ch] font-display text-lead text-ink-soft">
          A public board of index cards. Anyone can read it; signed-in readers can add cards and move their own.
        </p>
        <p className="mt-4 font-display text-caption tabular-nums text-ink-soft">
          {tasks.length > 0 && `${tasks.length} ${tasks.length === 1 ? "card" : "cards"} on the board, ${done} of them done. `}
          {currentUserId ? (
            "Drag your cards between columns to move them."
          ) : (
            <>
              <InkLink href="/auth?redirect=/tracker">Sign in</InkLink> to add and move cards.
            </>
          )}
        </p>
      </header>
      <div aria-hidden className="h-[5px] border-y border-b-rule border-t-ink" />

      <TrackerBoard initialTasks={tasks} currentUserId={currentUserId} isAdmin={isAdmin} />
    </div>
  )
}
