import { BadgeCheck, CalendarDays, Link2, Mail, MapPin, UserRound } from "lucide-react"
import { LoadingStatus, TextSkeleton } from "@/components/ui/page-loading"
import { Properties } from "@/components/ui/properties"
import { Skeleton } from "@/components/ui/skeleton"

const PROPERTIES = [
  { label: "Email", icon: <Mail />, width: "w-40" },
  { label: "Email check", icon: <BadgeCheck />, width: "w-20" },
  { label: "Location", icon: <MapPin />, width: "w-28" },
  { label: "Joined", icon: <CalendarDays />, width: "w-24" },
  { label: "Account", icon: <UserRound />, width: "w-16" },
  { label: "Connected", icon: <Link2 />, width: "w-16" },
]

/** Shown while the account server answers: the avatar, the name, the profile's property rows, the bio and actions. */
export default function ProfileLoading() {
  return (
    <div aria-busy="true" className="w-full">
      <LoadingStatus>Loading your profile…</LoadingStatus>
      <div aria-hidden>
        <div className="mb-8">
          <Skeleton className="mb-4 size-16 rounded-full" />
          <div className="flex h-10 items-center sm:h-12">
            <Skeleton className="h-8 w-1/2 sm:h-9" />
          </div>
          <Properties
            className="mt-5 grid-cols-[minmax(6.5rem,8rem)_minmax(0,1fr)] sm:grid-cols-[minmax(6.5rem,10rem)_minmax(0,1fr)]"
            items={PROPERTIES.map(({ label, icon, width }) => ({ label, icon, value: <Skeleton className={`h-3.5 ${width}`} /> }))}
          />
        </div>
        <div className="border-t border-border pt-6">
          <TextSkeleton lines={2} />
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          <Skeleton className="h-8 w-28 [@media(pointer:coarse)]:h-11" />
          <Skeleton className="h-8 w-24 [@media(pointer:coarse)]:h-11" />
        </div>
      </div>
    </div>
  )
}
