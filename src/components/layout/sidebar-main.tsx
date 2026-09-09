"use client"

import { useEffect, useState } from "react"
import { publicDashboardMenu } from "@/commons/constants/navigation-menu"
import { MdVerified as VerifiedIcon } from "react-icons/md"
import Typography from "@/components/ui/typography"
import { Avatar } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import SidebarSecondary from "./sidebar-secondary"
import type { OwnerProfile } from "@/services/visitor/owner-profile"

const SidebarMain = () => {
  const [profile, setProfile] = useState<OwnerProfile | null>(null)
  // Track when the profile fetch has settled so we never flash a placeholder name
  // ("Rizky Haksono") and then swap it for the real one ("rizkyhaksono") on refresh.
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    let active = true
    fetch("/api/owner-profile", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (active) setProfile((j?.data as OwnerProfile) ?? null)
      })
      .catch(() => {})
      .finally(() => {
        if (active) setSettled(true)
      })
    return () => {
      active = false
    }
  }, [])

  const name = profile?.name || "Rizky Haksono"
  // Owner headshot is the bundled asset, not the OAuth/Google avatar stored on the account.
  const avatar = "/rizky.jpg"

  return (
    <div className="sticky top-8 hidden max-h-[calc(100vh-4rem)] flex-col overflow-y-auto px-2 pb-4 pt-2 md:flex md:w-48 lg:w-52">
      <div className="mb-2 border-b border-border px-2 pb-3">
        <div className="relative">
          <Avatar className="mb-2 h-12 w-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img height={200} width={200} alt={name} src={avatar} draggable={false} className="h-full w-full object-cover" />
          </Avatar>
        </div>

        <div className="space-y-1">
          <Typography.H4 className="flex items-center text-base">
            {settled ? (
              <>
                {name}
                <VerifiedIcon size={18} className="ml-2 text-primary" />
              </>
            ) : (
              <Skeleton className="h-5 w-32" />
            )}
          </Typography.H4>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-2">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-green-500" />
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
