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
    <main id="main" className={`${PROSE_WIDTH} pb-20 pt-12 sm:pt-20`}>
      <NotFoundView
        title="This page did not load."
        action={
          <Button type="button" onClick={reset} className="min-h-11 md:min-h-8">
            Try again
          </Button>
        }
      >
        <p>Something went wrong while loading it. Try again, or take one of the ways back below.</p>
      </NotFoundView>
    </main>
  )
}
