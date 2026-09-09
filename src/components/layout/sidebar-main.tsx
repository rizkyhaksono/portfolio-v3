"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { publicDashboardMenu } from "@/commons/constants/navigation-menu"
import { MdVerified as VerifiedIcon } from "react-icons/md"
import Typography from "@/components/ui/typography"
import { Avatar } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import SidebarSecondary from "./sidebar-secondary"
import type { OwnerProfile } from "@/services/visitor/owner-profile"

interface OwnerHeaderProps {
  name: string
  settled: boolean
}

function OwnerHeader({ name, settled }: Readonly<OwnerHeaderProps>) {
  const ownerName = settled ? (
    <>
      {name}
      <VerifiedIcon size={18} className="ml-2 text-primary" />
    </>
  ) : (
    <Skeleton className="h-5 w-32" />
  )

  return (
    <div className="mb-2 border-b border-border px-2 pb-3">
      <Avatar className="relative mb-2 h-12 w-12">
        <Image src="/rizky.jpg" alt={name} fill sizes="48px" className="object-cover" draggable={false} />
      </Avatar>
      <div className="space-y-1">
        <Typography.H4 className="flex items-center text-base">{ownerName}</Typography.H4>
        <div className="mt-2 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden="true" />
          <Typography.P className="text-xs font-medium text-green-600 dark:text-green-400">Online</Typography.P>
          <Typography.P className="text-xs text-primary/55">@rizkyhaksono</Typography.P>
        </div>
      </div>
    </div>
  )
}

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
  return (
    <div className="sticky top-8 hidden max-h-[calc(100vh-4rem)] flex-col overflow-y-auto px-2 pb-4 pt-2 md:flex md:w-48 lg:w-52">
      <OwnerHeader name={name} settled={settled} />
      <SidebarSecondary menu={publicDashboardMenu} />
    </div>
  )
}

export default SidebarMain
