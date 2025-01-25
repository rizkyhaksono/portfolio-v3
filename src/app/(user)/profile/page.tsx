import { getProfile } from "@/services/user/profile"
import ProfileHeader from "./_components/profile-header"

const ProfilePage = async () => {
  const profile = await getProfile();

  return (
    <div className="flex flex-col gap-2">
      <ProfileHeader profile={profile.data} />
    </div>
  )
}

export default ProfilePage;