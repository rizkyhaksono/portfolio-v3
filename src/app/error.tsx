"use client"

import { Button } from "@/components/ui/button"
import NotFoundView from "@/components/ui/not-found-view"
import { SHELL_WIDTH } from "@/lib/design-system"

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ reset }: Readonly<ErrorPageProps>) {
  return (
    // The page's BaseLayout is gone with the error, so this keeps the shell's width and the main landmark.
    <main id="main" className={`${SHELL_WIDTH} pb-16 pt-8 sm:pb-24 sm:pt-12`}>
      <NotFoundView title="Something went wrong">
        <p>This page failed to load. Try again, or take one of the ways back below.</p>
        <Button type="button" onClick={reset} className="mt-6">
          Try again
        </Button>
      </NotFoundView>
    </main>
  )
}
