import { redirect } from "next/navigation"
import { SectionIcon } from "@/components/layout/section-icons"
import { PageHeader } from "@/components/ui/page-header"
import { StatusLine } from "@/components/ui/status-line"
import { getProfile } from "@/services/user/profile"

/** The signed-in profile, a sign-in redirect when the session has ended, or null when the API failed. */
export async function loadProfile(returnTo: string) {
  const profile = await getProfile().catch(() => null)
  if (profile?.status === 401) redirect(`/auth?redirect=${encodeURIComponent(returnTo)}`)
  return profile?.data ?? null
}

export function ProfileUnavailable() {
  return (
    <>
      <PageHeader icon={<SectionIcon href="/profile" />} title="Your profile did not load" />
      <StatusLine kind="failed">The account server did not answer. Reload the page in a minute.</StatusLine>
    </>
  )
}
