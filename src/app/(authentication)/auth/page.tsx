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

const ACCOUNT_USES = [
  { title: "Etan AI keeps your chats", detail: "Pick up any conversation where you left it." },
  { title: "Write in the public chat", detail: "Post and reply under your own name." },
  { title: "Move cards on the tracker", detail: "Drag tasks between the columns of the board." },
] as const

/** The reversed block beside the form: what an account is for. */
function AccountUses() {
  return (
    <div>
      <p className="font-display text-h2 text-balance">One account for the whole site.</p>
      <ul className="mt-6 border-t border-paper/30">
        {ACCOUNT_USES.map(({ title, detail }) => (
          <li key={title} className="border-b border-paper/30 py-4">
            <p className="font-display text-lead">{title}</p>
            <p className="mt-1 text-small text-paper/80">{detail}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function AuthPage() {
  return (
    <AuthShell
      title="Your account"
      standfirst="Sign in with your email or Google, or create an account."
      panel={<AccountUses />}
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
