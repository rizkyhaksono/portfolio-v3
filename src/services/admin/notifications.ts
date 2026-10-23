export type NotifType = "feedback" | "chat" | "tracker" | "reaction"

export interface AdminNotification {
  id: string
  type: NotifType
  title: string
  detail?: string
  href: string
  createdAt: string
}

export async function getAdminNotifications(): Promise<AdminNotification[]> {
  try {
    const res = await fetch("/api/v3/notifications", { cache: "no-store" })
    const json = await res.json().catch(() => null)
    if (!res.ok || !json?.data?.notifications) return []
    return json.data.notifications as AdminNotification[]
  } catch {
    return []
  }
}
