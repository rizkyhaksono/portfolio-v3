import { loadProfile, ProfileUnavailable } from "./_components/load-profile"
import { ProfileView } from "./_components/profile-view"

export default async function ProfilePage() {
  const profile = await loadProfile("/profile")
  if (!profile) return <ProfileUnavailable />
  return <ProfileView profile={profile} />
}
