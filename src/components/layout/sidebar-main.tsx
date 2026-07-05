"use client"

import { useEffect, useState } from "react"
import { publicDashboardMenu } from "@/commons/constants/navigation-menu"
import { MdVerified as VerifiedIcon } from "react-icons/md"
import Typography from "@/components/ui/typography"
import { Avatar } from "@/components/ui/avatar"
import SidebarSecondary from "./sidebar-secondary"
import type { OwnerProfile } from "@/services/visitor/owner-profile"

const SidebarMain = () => {
  const [profile, setProfile] = useState<OwnerProfile | null>(null)

  useEffect(() => {
    let active = true
    fetch("/api/owner-profile", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (active) setProfile((j?.data as OwnerProfile) ?? null)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const name = profile?.name || "Rizky Haksono"
  // Owner headshot is the bundled asset, not the OAuth/Google avatar stored on the account.
  const avatar = "/rizky.jpg"

  return (
    <div className="hidden max-h-[calc(100vh-4rem)] flex-col px-3 overflow-y-auto lg:w-64 md:w-52 top-16 pt-4 pb-6 sticky md:flex">
      <div className="mb-3 px-1">
        <div className="relative">
          <Avatar className={`w-24 h-24 mb-3 transition-transform duration-300`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img height={200} width={200} alt={name} src={avatar} draggable={false} className="h-full w-full object-cover" />
          </Avatar>
        </div>

        <div className="space-y-1">
          <Typography.H4 className="flex items-center">
            {name}
            <VerifiedIcon size={18} className="text-blue-400 ml-2" />
          </Typography.H4>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="absolute inset-0 w-3 h-3 rounded-full bg-green-500 animate-ping opacity-75" />
              </div>
              <Typography.P className="text-xs font-medium text-green-600 dark:text-green-400">Online</Typography.P>
            </div>
            <Typography.P className="text-xs text-primary/55">@rizkyhaksono</Typography.P>
          </div>
        </div>
      </div>
      <SidebarSecondary menu={publicDashboardMenu} />
    </div>
  )
}

export default SidebarMain
