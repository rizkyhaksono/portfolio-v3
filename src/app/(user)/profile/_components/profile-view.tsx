import Image from "next/image"
import Link from "next/link"
import { BadgeCheck, CalendarDays, Link2, Mail, MapPin, Pencil, UserRound } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/ui/page-header"
import { PlateFigure } from "@/components/ui/plate-figure"
import { Properties } from "@/components/ui/properties"
import type { ProfileData } from "@/commons/types/profile"
import { LogoutButton } from "./logout-button"

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

/** The signed-in account as a Notion page: cover, avatar as the page icon, name, properties, bio, actions. */
export function ProfileView({ profile }: Readonly<{ profile: ProfileData }>) {
  const isAdmin = profile.isAdmin || profile.role === "ADMIN"
  const portrait = profile.iconUrl || profile.avatarUrl
  const since = memberSince(profile.createdAt)
  const providers = profile.oauthAccounts?.map((account) => capitalise(account.provider)) ?? []

  const properties = [
    { label: "Email", icon: <Mail />, value: <span className="[overflow-wrap:anywhere]">{profile.email}</span> },
    {
      label: "Email check",
      icon: <BadgeCheck />,
      value: (
        <Badge variant={profile.emailVerified ? "default" : "outline"} status={profile.emailVerified ? "filled" : "dashed"}>
          {profile.emailVerified ? "Verified" : "Not verified yet"}
        </Badge>
      ),
    },
    { label: "Location", icon: <MapPin />, value: profile.location || <span className="text-muted-foreground">Not set</span> },
    ...(since ? [{ label: "Joined", icon: <CalendarDays />, value: since }] : []),
    { label: "Account", icon: <UserRound />, value: isAdmin ? "Administrator" : "Member" },
    {
      label: "Connected",
      icon: <Link2 />,
      value: providers.length ? providers.map((name) => <Badge key={name}>{name}</Badge>) : <span className="text-muted-foreground">None</span>,
    },
  ]

  return (
    <article className="w-full">
      {profile.bannerUrl && (
        <PlateFigure className="mb-8">
          <div className="relative aspect-[3/1]">
            <Image src={profile.bannerUrl} alt="" fill unoptimized sizes="(min-width: 768px) 44rem, 100vw" className="object-cover" />
          </div>
        </PlateFigure>
      )}
      <PageHeader
        icon={
          <Avatar className="size-16">
            {portrait && <AvatarImage src={portrait} alt="" referrerPolicy="no-referrer" className="object-cover" />}
            <AvatarFallback className="bg-tint-strong text-h3">{initials(profile.name)}</AvatarFallback>
          </Avatar>
        }
        title={<span className="[overflow-wrap:anywhere]">{profile.name}</span>}
        description={profile.headline || undefined}
      >
        <Properties items={properties} />
      </PageHeader>

      <div className="border-t border-border pt-6">
        {profile.about ? (
          <p className="whitespace-pre-line text-body text-foreground">{profile.about}</p>
        ) : (
          <p className="text-body text-muted-foreground">No bio yet. Add a few lines from the edit page.</p>
        )}
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link href="/profile/edit">
            <Pencil aria-hidden strokeWidth={1.5} />
            Edit profile
          </Link>
        </Button>
        {isAdmin && (
          <Button asChild variant="ghost">
            <Link href="/admin/dashboard">Admin dashboard</Link>
          </Button>
        )}
        <LogoutButton />
      </div>
    </article>
  )
}
