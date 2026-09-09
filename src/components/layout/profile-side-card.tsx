"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import Typography from "@/components/ui/typography"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { performVisitorLogout } from "@/lib/visitor-logout"
import { getProfile } from "@/services/user/profile"
import type { ProfileResponse } from "@/commons/types/profile"
import AuthCard from "./auth-card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Home, LogOutIcon, User } from "lucide-react"
import Link from "next/link"

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((n) => n.charAt(0).toUpperCase())
    .join("")
    .slice(0, 2)
}

const ProfileSideCard = ({ avatarSize }: { avatarSize?: number }) => {
  const [profile, setProfile] = useState<ProfileResponse | null>(null)

  useEffect(() => {
    getProfile().then(setProfile)
  }, [])

  if (!profile || profile?.status === 401 || !profile?.data?.name) return <AuthCard className="border rounded-none" />

  const avatarSrc = profile.data.iconUrl || profile.data.avatarUrl
  const avatarClass = cn(
    "h-10 w-10",
    avatarSize === 8 && "h-8 w-8",
    avatarSize === 12 && "h-12 w-12"
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-full overflow-hidden">
        <div data-cy="auth-card-side" className="flex w-full min-w-0 cursor-pointer items-center gap-3 border p-3 transition-colors hover:bg-secondary">
          <Avatar className={cn(avatarClass, "shrink-0")}>
            {avatarSrc ? <AvatarImage src={avatarSrc} alt={profile.data.name} className="object-cover" referrerPolicy="no-referrer" /> : null}
            <AvatarFallback>{getInitials(profile.data.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 space-y-1">
            <Typography.P className="truncate text-start text-sm font-medium" title={profile.data.name}>{profile.data.name}</Typography.P>
            <Typography.P className="truncate text-start text-xs text-muted-foreground" title={profile.data.email}>{profile.data.email}</Typography.P>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="start" sideOffset={8} collisionPadding={12} className="w-[--radix-popper-anchor-width] min-w-52">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/profile">
          <DropdownMenuItem data-cy="profile-btn">
            <User size={16} className="mr-3" />
            <span>Profile</span>
          </DropdownMenuItem>
        </Link>
        {profile?.data?.role === "ADMIN" && (
          <Link href="/admin/dashboard">
            <DropdownMenuItem data-cy="admin-btn">
              <Home size={16} className="mr-3" />
              <span>Admin Dashboard</span>
            </DropdownMenuItem>
          </Link>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem data-cy="sign-out" onClick={() => performVisitorLogout()}>
          <LogOutIcon size={16} className="mr-3" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileSideCard
