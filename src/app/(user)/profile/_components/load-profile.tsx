import { redirect } from "next/navigation"
import { NotFoundView } from "@/components/ui/not-found-view"
import { getProfile } from "@/services/user/profile"

/** The signed-in profile, a sign-in redirect when the session has ended, or null when the API failed. */
export async function loadProfile(returnTo: string) {
  const profile = await getProfile().catch(() => null)
  if (profile?.status === 401) redirect(`/auth?redirect=${encodeURIComponent(returnTo)}`)
  return profile?.data ?? null
}

export function ProfileUnavailable() {
  return (
    <NotFoundView title="Your profile did not load">
      <p>The account server did not answer. Reload the page in a minute.</p>
    </NotFoundView>
  )
}
