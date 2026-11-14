import type { Metadata } from "next"
import { PageHeader } from "@/components/ui/page-header"
import { loadProfile, ProfileUnavailable } from "../_components/load-profile"
import { EditProfileForm } from "./_components/edit-profile-form"

export const metadata: Metadata = {
  title: "Edit profile | Rizky Haksono",
  robots: { index: false, follow: false },
}

export default async function EditProfilePage() {
  const profile = await loadProfile("/profile/edit")
  if (!profile) return <ProfileUnavailable />

  return (
    <>
      <PageHeader title="Edit your profile" />
      <EditProfileForm profile={profile} />
    </>
  )
}
