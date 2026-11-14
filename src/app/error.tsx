"use client"

import { Button } from "@/components/ui/button"
import NotFoundView from "@/components/ui/not-found-view"
import { PROSE_WIDTH } from "@/lib/design-system"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ reset }: Readonly<ErrorPageProps>) {
  return (
    // The page's BaseLayout is gone with the error, so this keeps the reading column and the main landmark.
    <main id="main" className={`${PROSE_WIDTH} pb-20 pt-10 sm:pt-16`}>
      <NotFoundView title="This page did not load.">
        <p>Something went wrong while loading it. Try again, or take one of the ways back below.</p>
        <Button type="button" onClick={reset} className="mt-4">
          Try again
        </Button>
      </NotFoundView>
    </main>
  )
}
