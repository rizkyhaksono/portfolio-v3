import { getProfile } from "@/services/user/profile"
import ProfileHeader from "./_components/profile-header"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

function ProfileSkeleton() {
  return (
    <Card className="overflow-hidden">
      <div className="h-32 bg-muted animate-pulse" />
      <CardContent className="relative px-6 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
          <Skeleton className="h-24 w-24 rounded-full border-4 border-background" />
          <div className="flex-1 space-y-2 sm:mb-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="mt-6 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="grid grid-cols-2 gap-3 mt-6">
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg col-span-2" />
        </div>
        <div className="flex gap-3 mt-6">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </CardContent>
    </Card>
  )
}

const ProfilePage = async () => {
  const profile = await getProfile()

  return (
    <div className="flex flex-col gap-4 max-w-8xl mx-auto">
      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileHeader profile={profile.data} />
      </Suspense>
    </div>
  )
}

export default ProfilePage
