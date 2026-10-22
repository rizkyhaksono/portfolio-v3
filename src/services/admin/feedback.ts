const API = "/api/v3"

export type FeedbackStatus = "new" | "read" | "archived"

export interface AdminFeedback {
  id: string
  message: string
  category: string
  email: string | null
  pageUrl: string | null
  status: FeedbackStatus
  createdAt: string
  updatedAt: string
}

export async function getFeedbackClient(
  { status, page = 1, limit = 20 }: { status?: FeedbackStatus; page?: number; limit?: number } = {},
): Promise<{ items: AdminFeedback[]; total: number }> {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (status) query.set("status", status)
  const res = await fetch(`${API}/feedback?${query}`, { cache: "no-store" })
  const json = await res.json().catch(() => null)
  if (!res.ok || json?.status >= 400) throw new Error(`Feedback did not load (${res.status}).`)
  return json.data as { items: AdminFeedback[]; total: number }
}

export async function updateFeedbackStatusClient(id: string, status: FeedbackStatus): Promise<void> {
  const res = await fetch(`${API}/feedback/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  })
  const json = await res.json().catch(() => null)
  if (!res.ok || json?.status >= 400) throw new Error(`Status did not change (${res.status}).`)
}
