"use client"

import { Button } from "@/components/ui/button"
import { InkLink } from "@/components/ui/ink-link"
import NotFoundView from "@/components/ui/not-found-view"

interface AdminErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

/** The spine stays in place; only the page area reports the failure. */
export default function AdminError({ reset }: Readonly<AdminErrorProps>) {
  return (
    <NotFoundView title="This page failed to load" className="py-8 md:py-12">
      <p>The API or Umami may be down for a moment. Try again, or go back to the dashboard.</p>
      <div className="mt-6 flex flex-wrap items-center gap-6 text-body">
        <Button type="button" onClick={reset}>
          Try again
        </Button>
        <InkLink href="/admin/dashboard">Dashboard</InkLink>
      </div>
    </NotFoundView>
  )
}
