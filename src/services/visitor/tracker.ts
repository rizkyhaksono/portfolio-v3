import { getClientAuthorizationHeader } from "@/commons/helpers/client-auth-header"

const API_URL = process.env.NEXT_PUBLIC_API_URL

export type TrackerStatus = "todo" | "in_progress" | "in_qa" | "done"

export interface TrackerTask {
  id: string
  key: string
  title: string
  description: string | null
  status: TrackerStatus
  priority: string
  type: string
  order: number
  createdById: string | null
  createdByName: string | null
  createdByAvatar: string | null
  createdAt: string
  updatedAt: string
}

export const TRACKER_COLUMNS: { id: TrackerStatus; label: string }[] = [
  { id: "todo", label: "To Do" },
  { id: "in_progress", label: "In Progress" },
  { id: "in_qa", label: "In QA" },
  { id: "done", label: "Done" },
]

/** Public read — used in the server component for the initial board. */
export async function getTrackerTasks(): Promise<TrackerTask[]> {
  try {
    const res = await fetch(`${API_URL}/v3/tracker/`, { cache: "no-store" })
    if (!res.ok) return []
    const json = await res.json()
    return (json.data ?? []) as TrackerTask[]
  } catch {
    return []
  }
}

type CreateInput = { title: string; description?: string; status?: TrackerStatus; priority?: string; type?: string }
type UpdateInput = Partial<Pick<TrackerTask, "title" | "description" | "status" | "priority" | "type" | "order">>

export async function createTrackerTaskClient(input: CreateInput): Promise<TrackerTask> {
  const res = await fetch(`${API_URL}/v3/tracker/`, {
    method: "POST",
    headers: getClientAuthorizationHeader(),
    body: JSON.stringify(input),
  })
  const json = await res.json().catch(() => null)
  if (!res.ok || json?.status >= 400) throw new Error(json?.message || `Failed to create (${res.status})`)
  return json.data as TrackerTask
}

export async function updateTrackerTaskClient(id: string, input: UpdateInput): Promise<TrackerTask> {
  const res = await fetch(`${API_URL}/v3/tracker/${id}`, {
    method: "PATCH",
    headers: getClientAuthorizationHeader(),
    body: JSON.stringify(input),
  })
  const json = await res.json().catch(() => null)
  if (!res.ok || json?.status >= 400) throw new Error(json?.message || `Failed to update (${res.status})`)
  return json.data as TrackerTask
}

export async function deleteTrackerTaskClient(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/v3/tracker/${id}`, {
    method: "DELETE",
    headers: getClientAuthorizationHeader(),
  })
  const json = await res.json().catch(() => null)
  if (!res.ok || json?.status >= 400) throw new Error(json?.message || `Failed to delete (${res.status})`)
}
