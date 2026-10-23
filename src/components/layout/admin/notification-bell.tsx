"use client"

import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react"
import Link from "next/link"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getAdminNotifications, type AdminNotification } from "@/services/admin/notifications"
import { safeRedirect } from "@/lib/utils"
import { timeAgo } from "./admin-format"

const SEEN_KEY = "admin_notifs_seen_at"
const POLL_MS = 60_000
const HOVER_CLOSE_MS = 200

const readSeen = () => {
  try {
    return localStorage.getItem(SEEN_KEY) ?? ""
  } catch {
    return ""
  }
}

/** Opens a dropdown while a mouse rests on the trigger or the menu. Touch and keyboard keep click-to-open. */
function useHoverOpen() {
  const [open, setOpen] = useState(false)
  const byHover = useRef(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(closeTimer.current), [])

  const enter = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return
    clearTimeout(closeTimer.current)
    if (!open) byHover.current = true
    setOpen(true)
  }
  const leave = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" || !byHover.current) return
    clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(false), HOVER_CLOSE_MS)
  }
  const onOpenChange = (next: boolean) => {
    byHover.current = false
    setOpen(next)
  }
  // A hover-opened menu must not take focus away from whatever the admin is typing in.
  const keepFocus = (e: Event) => {
    if (byHover.current) e.preventDefault()
  }

  return {
    root: { open, onOpenChange, modal: false },
    trigger: {
      onPointerEnter: enter,
      onPointerLeave: leave,
      // Radix toggles on pointerdown, which would close a menu the hover just opened.
      onPointerDown: (e: PointerEvent) => {
        if (e.pointerType === "mouse" && open) e.preventDefault()
        byHover.current = false
      },
    },
    content: { onPointerEnter: enter, onPointerLeave: leave, onOpenAutoFocus: keepFocus, onCloseAutoFocus: keepFocus },
  }
}

/** Bell with an unread count. Polls once a minute, only while the tab is visible. */
export function NotificationBell() {
  const [items, setItems] = useState<AdminNotification[]>([])
  const [seenAt, setSeenAt] = useState("")
  const hover = useHoverOpen()

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
    <DropdownMenu {...hover.root}>
      <DropdownMenuTrigger asChild {...hover.trigger}>
        <Button variant="ghost" size="icon" className="relative" aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}>
          <Bell strokeWidth={1.5} aria-hidden />
          {unread > 0 && (
            <span aria-hidden className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center bg-ink px-1 text-caption font-semibold leading-none tabular-nums text-paper">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" {...hover.content} className="w-[min(20rem,calc(100vw-2rem))] p-0">
        <div className="flex items-center justify-between gap-3 border-b border-ink px-3 py-2">
          <p className="font-display text-h4 text-ink">Notifications</p>
          {unread > 0 && (
            <button type="button" onClick={markAllRead} className="text-small text-ink underline-offset-[0.18em] hover:underline">
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {items.length === 0 ? (
            <p className="px-3 py-8 text-center font-display text-small text-ink-soft">Nothing new.</p>
          ) : (
            items.map((n) => (
              <div key={n.id} className="border-b border-rule last:border-b-0">
                <DropdownMenuItem asChild className="block px-3 py-2.5">
                  <Link href={safeRedirect(n.href, "/admin/dashboard")}>
                    <span className="flex items-baseline gap-2">
                      {isUnread(n) && (
                        <span className="inline-flex shrink-0 items-center gap-1 text-caption font-semibold text-ink">
                          <span aria-hidden className="size-2 bg-ink" />
                          New
                        </span>
                      )}
                      <span className="truncate text-small font-semibold text-ink">{n.title}</span>
                    </span>
                    {n.detail && <span className="mt-0.5 block truncate text-small text-ink-soft">{n.detail}</span>}
                    <span className="mt-0.5 block font-display text-caption text-ink-soft">{timeAgo(n.createdAt)}</span>
                  </Link>
                </DropdownMenuItem>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
