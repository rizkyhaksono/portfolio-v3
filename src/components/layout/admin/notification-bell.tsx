"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getAdminNotifications, type AdminNotification } from "@/services/admin/notifications"
import { safeRedirect } from "@/lib/utils"
import { timeAgo } from "./admin-format"

const SEEN_KEY = "admin_notifs_seen_at"
const POLL_MS = 60_000

const readSeen = () => {
  try {
    return localStorage.getItem(SEEN_KEY) ?? ""
  } catch {
    return ""
  }
}

/** Bell with an unread count; opens on click. Polls once a minute, only while the tab is visible. */
export function NotificationBell() {
  const [items, setItems] = useState<AdminNotification[]>([])
  const [seenAt, setSeenAt] = useState("")

  const load = useCallback(async () => setItems(await getAdminNotifications()), [])

  useEffect(() => {
    setSeenAt(readSeen())
    let timer: ReturnType<typeof setInterval> | undefined
    const stop = () => {
      clearInterval(timer)
      timer = undefined
    }
    const start = () => {
      if (timer === undefined) timer = setInterval(load, POLL_MS)
    }
    const onVisibilityChange = () => {
      if (document.hidden) return stop()
      void load()
      start()
    }

    void load()
    if (!document.hidden) start()
    document.addEventListener("visibilitychange", onVisibilityChange)
    return () => {
      stop()
      document.removeEventListener("visibilitychange", onVisibilityChange)
    }
  }, [load])

  const isUnread = (n: AdminNotification) => !seenAt || n.createdAt > seenAt
  const unread = items.filter(isUnread).length

  const markAllRead = () => {
    const now = new Date().toISOString()
    try {
      localStorage.setItem(SEEN_KEY, now)
    } catch {}
    setSeenAt(now)
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative size-11 text-muted-foreground hover:text-foreground lg:size-8"
          aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
        >
          <Bell strokeWidth={1.5} aria-hidden />
          {unread > 0 && (
            <span aria-hidden className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-caption font-medium leading-none tabular-nums text-background lg:-right-0.5 lg:-top-0.5">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-w-[calc(100vw-1rem)]">
        <div className="flex items-center justify-between gap-3 pr-1">
          <DropdownMenuLabel className="text-small">Notifications</DropdownMenuLabel>
          {unread > 0 && (
            <Button type="button" variant="ghost" size="sm" onClick={markAllRead} className="text-muted-foreground hover:text-foreground">
              Mark all read
            </Button>
          )}
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {items.length === 0 ? (
            <p className="px-2 py-6 text-small text-muted-foreground">Nothing new.</p>
          ) : (
            items.map((n) => (
              <DropdownMenuItem key={n.id} asChild className="flex items-start gap-2 py-1.5">
                <Link href={safeRedirect(n.href, "/admin/dashboard")}>
                  <span aria-hidden className="mt-2 flex size-1.5 shrink-0">
                    {isUnread(n) && <span className="size-1.5 rounded-full bg-foreground" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-foreground">
                      {isUnread(n) && <span className="sr-only">New: </span>}
                      {n.title}
                    </span>
                    {n.detail && <span className="block truncate text-muted-foreground">{n.detail}</span>}
                    <span className="block text-caption text-muted-foreground">{timeAgo(n.createdAt)}</span>
                  </span>
                </Link>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
