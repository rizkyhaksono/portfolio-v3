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

  if (!profile || profile?.status === 401 || !profile?.data?.name) return <AuthCard className="border rounded-xl" />

  const avatarSrc = profile.data.iconUrl || profile.data.avatarUrl
  const avatarClass = cn(
    "h-10 w-10",
    avatarSize === 8 && "h-8 w-8",
    avatarSize === 12 && "h-12 w-12"
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="w-full overflow-hidden">
        <div data-cy="auth-card-side" className={cn(`flex p-3 gap-3 items-center cursor-pointer border rounded-xl transition-all dark:hover:bg-[#262626] hover:bg-[#D9D9D955]`)}>
          <Avatar className={cn(avatarClass)}>
            {avatarSrc ? <AvatarImage src={avatarSrc} alt={profile.data.name} className="object-cover" referrerPolicy="no-referrer" /> : null}
            <AvatarFallback>{getInitials(profile.data.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <Typography.P className="text-sm text-start font-medium text-ellipsis truncate max-w-[140px]">{profile?.data?.name}</Typography.P>
            <Typography.P className="text-xs text-start opacity-75 text-ellipsis truncate max-w-[140px]">{profile?.data?.email}</Typography.P>
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
