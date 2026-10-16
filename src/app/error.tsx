"use client"

import { Button } from "@/components/ui/button"
import NotFoundView from "@/components/ui/not-found-view"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ reset }: Readonly<ErrorPageProps>) {
  return (
    // The page's BaseLayout is gone with the error, so this keeps the shell's gutter and the main landmark.
    <main id="main" className="px-[clamp(20px,4vw,48px)]">
      <NotFoundView title="Something went wrong">
        <p>This page failed to load. Try again, or take one of the ways back below.</p>
        <Button type="button" onClick={reset} className="mt-6">
          Try again
        </Button>
      </NotFoundView>
    </main>
  )
}
