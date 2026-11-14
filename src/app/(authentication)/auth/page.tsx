import { Suspense } from "react"
import { AuthShell } from "@/components/layout/auth-shell"
import { InkLink } from "@/components/ui/ink-link"
import { Skeleton } from "@/components/ui/skeleton"
import { AuthTabs } from "./_components/auth-tabs"

/** Grey stand-ins while the tabs read `?tab=` on the client. */
function AuthTabsFallback() {
  return (
    <div aria-hidden>
      <Skeleton className="h-6 w-56 rounded-md" />
      <div className="mt-8 flex flex-col gap-6">
        <Skeleton className="h-[4.5rem] rounded-lg" />
        <Skeleton className="h-[4.5rem] rounded-lg" />
        <Skeleton className="h-10 rounded-lg" />
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <AuthShell
      title="Your account"
      description="One account for the whole site, so you can post and reply in the public chat under your own name."
      footer={
        <p>
          By continuing you agree to the <InkLink href="/legal/terms">terms of service</InkLink> and the{" "}
          <InkLink href="/legal/privacy">privacy policy</InkLink>.
        </p>
      }
    >
      <Suspense fallback={<AuthTabsFallback />}>
        <AuthTabs />
      </Suspense>
    </AuthShell>
  )
}
