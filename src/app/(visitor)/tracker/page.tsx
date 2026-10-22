import { getTrackerTasks } from "@/services/visitor/tracker"
import { getProfile } from "@/services/user/profile"
import { hasSession } from "@/lib/session"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { StatusLine } from "@/components/ui/status-line"
import TrackerBoard from "./_components/tracker-board"

export const dynamic = "force-dynamic"

export default async function TrackerPage() {
  // Readers without a session cookie skip the /v3/me round trip.
  const signedIn = await hasSession()
  const [tasks, profile] = await Promise.all([getTrackerTasks(), signedIn ? getProfile().catch(() => null) : null])
  const currentUserId: string | null = profile?.data?.id ?? null
  const isAdmin = profile?.data?.role === "ADMIN"
  const done = tasks?.filter((t) => t.status === "done").length ?? 0

  return (
    <div>
      <header className="pb-8">
        <h1 className="font-display text-h1 text-balance text-ink">Tracker</h1>
        <p className="mt-4 font-display text-caption tabular-nums text-ink-soft">
          {tasks?.length ? `${tasks.length} ${tasks.length === 1 ? "card" : "cards"} on the board, ${done} of them done. ` : null}
          {currentUserId && (
            <>
              <span className="hidden sm:inline">Drag your cards between columns to move them.</span>
              <span className="sm:hidden">Use Move to on a card to change its column.</span>
            </>
          )}
        </p>
        {!currentUserId && (
          <Button asChild variant="outline" size="sm" className="mt-4">
            <Link href="/auth?redirect=/tracker">Sign in to add cards</Link>
          </Button>
        )}
      </header>
      <div aria-hidden className="border-t border-ink" />

      {tasks ? (
        <TrackerBoard initialTasks={tasks} currentUserId={currentUserId} isAdmin={isAdmin} />
      ) : (
        <StatusLine
          kind="failed"
          className="mt-8"
          action={
            <Button asChild variant="outline" size="sm">
              <a href="/tracker">Try again</a>
            </Button>
          }
        >
          The board did not load. The tracker server may be down for a moment.
        </StatusLine>
      )}
    </div>
  )
}
