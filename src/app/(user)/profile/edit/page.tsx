import { getProfile } from "@/services/user/profile"
import { EditProfileForm } from "./_components/edit-profile-form"

export const dynamic = "force-dynamic"

export default async function EditProfilePage() {
  const profile = await getProfile()

  return (
    <div>
      <EditProfileForm profile={profile} />
    </div>
  )
}
