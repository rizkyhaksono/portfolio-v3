import { Suspense } from "react"
import { AuthShell } from "@/components/layout/auth-shell"
import { InkLink } from "@/components/ui/ink-link"
import { Skeleton } from "@/components/ui/skeleton"
import { AuthTabs } from "./_components/auth-tabs"

/** Static ruled stand-in while the tabs read `?tab=` on the client. */
function AuthTabsFallback() {
  return (
    <div aria-hidden>
      <div className="h-11 border-b border-rule" />
      <div className="mt-8 flex flex-col gap-6">
        <Skeleton className="h-[4.5rem]" />
        <Skeleton className="h-[4.5rem]" />
        <Skeleton className="h-10" />
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <AuthShell
      title="Your account"
      standfirst="Sign in to keep your Etan AI chats, write in the public chat and move cards on the tracker."
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
