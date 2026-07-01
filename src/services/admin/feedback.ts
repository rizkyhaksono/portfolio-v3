import { getClientAuthorizationHeader } from "@/commons/helpers/client-auth-header"

const API_URL = process.env.NEXT_PUBLIC_API_URL

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

export async function getFeedbackClient(status?: FeedbackStatus): Promise<{ items: AdminFeedback[]; total: number }> {
  const qs = status ? `?status=${status}` : ""
  const res = await fetch(`${API_URL}/v3/feedback${qs}`, {
    headers: getClientAuthorizationHeader(),
    cache: "no-store",
  })
  const json = await res.json().catch(() => null)
  if (!res.ok || json?.status >= 400) throw new Error(json?.message || `Failed (${res.status})`)
  return json.data as { items: AdminFeedback[]; total: number }
}

export async function updateFeedbackStatusClient(id: string, status: FeedbackStatus): Promise<void> {
  const res = await fetch(`${API_URL}/v3/feedback/${id}`, {
    method: "PATCH",
    headers: getClientAuthorizationHeader(),
    body: JSON.stringify({ status }),
  })
  const json = await res.json().catch(() => null)
  if (!res.ok || json?.status >= 400) throw new Error(json?.message || `Failed (${res.status})`)
}
