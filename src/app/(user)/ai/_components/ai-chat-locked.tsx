import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"

/** Signed-out chat: a ruled sign-in slip with the RH mark. Chat history is per user, so nothing is previewed. */
export default function AIChatLocked() {
  return (
    <section aria-labelledby="ai-signin-title" className="border border-foreground p-[3px]">
      <div className="grid gap-6 border border-border p-6 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-8 sm:p-8">
        <Logo variant="mark" className="w-20 sm:w-24" />
        <div>
          <h2 id="ai-signin-title" className="text-h3 text-balance text-foreground">
            Sign in to write to Etan
          </h2>
          <p className="mt-2 max-w-[52ch] text-body text-muted-foreground">
            Etan answers questions about Rizky&apos;s projects, skills and background, and keeps each conversation under
            your account.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-4">
            <Button asChild>
              <Link href="/auth?redirect=/ai">Sign in</Link>
            </Button>
            <p className="text-caption text-muted-foreground">The document reader and Hire fit work without an account.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
