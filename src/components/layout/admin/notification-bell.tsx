"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Bell, MessageSquare, MessageCircle, KanbanSquare, ThumbsUp, CheckCheck, Inbox, type LucideIcon } from "lucide-react"
import { getAdminNotifications, type AdminNotification, type NotifType } from "@/services/admin/notifications"

const SEEN_KEY = "admin_notifs_seen_at"

const ICONS: Record<NotifType, LucideIcon> = {
  feedback: MessageSquare,
  chat: MessageCircle,
  tracker: KanbanSquare,
  reaction: ThumbsUp,
}

export function NotificationBell() {
  const [items, setItems] = useState<AdminNotification[]>([])
  const [seenAt, setSeenAt] = useState<string>("")

  const load = useCallback(async () => {
    setItems(await getAdminNotifications())
  }, [])

  useEffect(() => {
    setSeenAt(localStorage.getItem(SEEN_KEY) ?? "")
    load()
    const id = setInterval(load, 60000)
    return () => clearInterval(id)
  }, [load])

  const isUnread = (n: AdminNotification) => !seenAt || n.createdAt > seenAt
  const unread = items.filter(isUnread).length

  const markAllRead = () => {
    const now = new Date().toISOString()
    localStorage.setItem(SEEN_KEY, now)
    setSeenAt(now)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground ring-2 ring-background">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b px-3 py-2">
          <p className="text-sm font-semibold">Notifications</p>
          {items.length > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
              <CheckCheck className="h-3.5 w-3.5" /> Mark all read
            </button>
          )}
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-10 text-muted-foreground">
              <Inbox className="h-6 w-6" />
              <p className="text-xs">No notifications</p>
            </div>
          ) : (
            items.map((n) => {
              const Icon = ICONS[n.type]
              const unreadItem = isUnread(n)
              return (
                <Link
                  key={n.id}
                  href={n.href}
                  className={cn("flex gap-2.5 border-b border-border/40 px-3 py-2.5 transition-colors last:border-b-0 hover:bg-muted/60", unreadItem && "bg-primary/[0.04]")}
                >
                  <span className="mt-0.5 shrink-0 text-muted-foreground">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{n.title}</span>
                    {n.detail && <span className="block truncate text-xs text-muted-foreground">{n.detail}</span>}
                    <span className="block text-[11px] text-muted-foreground/70">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </span>
                  </span>
                  {unreadItem && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
                </Link>
              )
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
