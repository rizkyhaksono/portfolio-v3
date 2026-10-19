import type { Metadata } from "next"
import { loadProfile, ProfileUnavailable } from "../_components/load-profile"
import { ProfileSheet } from "../_components/profile-sheet"
import { EditProfileForm } from "./_components/edit-profile-form"

export const metadata: Metadata = {
  title: "Edit profile | Rizky Haksono",
  robots: { index: false, follow: false },
}

export default async function EditProfilePage() {
  const profile = await loadProfile("/profile/edit")
  if (!profile) return <ProfileUnavailable />

  return (
    <ProfileSheet title="Edit your profile" standfirst="How your name, headline and cover read on your profile.">
      <EditProfileForm profile={profile} />
    </ProfileSheet>
  )
}
