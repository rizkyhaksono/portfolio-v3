import type { Metadata } from "next"
import { AuthShell } from "@/components/layout/auth-shell"
import { InkLink } from "@/components/ui/ink-link"
import { AdminLoginForm } from "./_components/login-form"

export const metadata: Metadata = {
  title: "Admin sign in | Rizky Haksono",
  robots: { index: false, follow: false },
}

export default function AdminAuthLoginPage() {
  return (
    <AuthShell
      variant="narrow"
      title="Admin sign in"
      standfirst="Projects, writing and the records behind the site."
      footer={<InkLink href="/" className="inline-flex min-h-11 items-center md:min-h-0">Back to the portfolio</InkLink>}
    >
      <AdminLoginForm />
    </AuthShell>
  )
}
