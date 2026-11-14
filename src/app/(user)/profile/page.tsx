import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlateFigure } from "@/components/ui/plate-figure"
import { loadProfile, ProfileUnavailable } from "./_components/load-profile"
import { LogoutButton } from "./_components/logout-button"
import { ProfileSheet } from "./_components/profile-sheet"

/** A plain label and value; the label sits above the value on phones. */
function Entry({ term, children }: Readonly<{ term: string; children: React.ReactNode }>) {
  return (
    <div className="grid gap-1 py-2 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4">
      <dt className="text-small text-muted-foreground">{term}</dt>
      <dd className="min-w-0 text-body text-foreground [overflow-wrap:anywhere]">{children}</dd>
    </div>
  )
}

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("")

const capitalise = (word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()

function memberSince(iso: string) {
  const date = new Date(iso)
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "Asia/Jakarta" })
}

export default async function ProfilePage() {
  const profile = await loadProfile("/profile")
  if (!profile) return <ProfileUnavailable />

  const isAdmin = profile.isAdmin || profile.role === "ADMIN"
  const portrait = profile.iconUrl || profile.avatarUrl
  const since = memberSince(profile.createdAt)
  const providers = profile.oauthAccounts?.map((account) => capitalise(account.provider)) ?? []

  return (
    <ProfileSheet
      title={profile.name}
      description={profile.headline || undefined}
      portrait={
        <Avatar className="size-16 sm:size-20">
          {portrait && <AvatarImage src={portrait} alt="" referrerPolicy="no-referrer" className="object-cover" />}
          <AvatarFallback className="text-h3">{initials(profile.name)}</AvatarFallback>
        </Avatar>
      }
      cover={
        profile.bannerUrl ? (
          <PlateFigure>
            <div className="relative aspect-[3/1]">
              <Image src={profile.bannerUrl} alt="" fill unoptimized sizes="(min-width: 768px) 40rem, 100vw" className="object-cover" />
            </div>
          </PlateFigure>
        ) : undefined
      }
    >
      {profile.about ? (
        <p className="max-w-[60ch] whitespace-pre-line text-body text-foreground">{profile.about}</p>
      ) : (
        <p className="text-body text-muted-foreground">No bio yet. Add a few lines from the edit page.</p>
      )}

      <dl className="mt-6 flex flex-col">
        <Entry term="Email">{profile.email}</Entry>
        <Entry term="Email check">
          <Badge variant="outline" status={profile.emailVerified ? "filled" : "dashed"}>
            {profile.emailVerified ? "Verified" : "Not verified yet"}
          </Badge>
        </Entry>
        <Entry term="Location">{profile.location || "Not set"}</Entry>
        {since && <Entry term="Member since">{since}</Entry>}
        <Entry term="Account">{isAdmin ? "Administrator" : "Member"}</Entry>
        <Entry term="Connected accounts">{providers.length ? providers.join(", ") : "None"}</Entry>
      </dl>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/profile/edit">Edit profile</Link>
        </Button>
        {isAdmin && (
          <Button asChild variant="outline">
            <Link href="/admin/dashboard">Admin dashboard</Link>
          </Button>
        )}
        <LogoutButton />
      </div>
    </ProfileSheet>
  )
}
