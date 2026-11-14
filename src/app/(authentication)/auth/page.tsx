import { Suspense } from "react"
import { AuthShell } from "@/components/layout/auth-shell"
import { InkLink } from "@/components/ui/ink-link"
import { Skeleton } from "@/components/ui/skeleton"
import { AuthPanel } from "./_components/auth-panel"

/** Grey stand-ins while the panel reads `?tab=` on the client. */
function AuthPanelFallback() {
  return (
    <div aria-hidden className="flex flex-col gap-4">
      <Skeleton className="h-14" />
      <Skeleton className="h-14" />
      <Skeleton className="h-10" />
    </div>
  )
}

export default function AuthPage() {
  return (
    <AuthShell
      title="One account for the site."
      description="Sign in or create one."
      footer={
        <p>
          By continuing you agree to the <InkLink href="/legal/terms">terms of service</InkLink> and the{" "}
          <InkLink href="/legal/privacy">privacy policy</InkLink>.
        </p>
      }
    >
      <Suspense fallback={<AuthPanelFallback />}>
        <AuthPanel />
      </Suspense>
    </AuthShell>
  )
}
