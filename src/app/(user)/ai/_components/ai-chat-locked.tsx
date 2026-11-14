import Link from "next/link"
import { Button } from "@/components/ui/button"

/** Signed-out chat: a sign-in card. Chat history is per user, so nothing is previewed. */
export default function AIChatLocked() {
  return (
    <section aria-labelledby="ai-signin-title" className="rounded-2xl bg-muted p-6 sm:p-8">
      <h2 id="ai-signin-title" className="text-h3 text-balance text-foreground">
        Sign in to write to Etan
      </h2>
      <p className="mt-2 max-w-[52ch] text-body text-muted-foreground">
        Etan answers questions about Rizky&apos;s projects, skills and background, and keeps each conversation under your
        account.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
        <Button asChild>
          <Link href="/auth?redirect=/ai">Sign in</Link>
        </Button>
        <p className="text-caption text-muted-foreground">The document reader and Hire fit work without an account.</p>
      </div>
    </section>
  )
}
