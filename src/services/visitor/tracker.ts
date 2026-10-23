import { serverApiUrl } from "@/lib/api-base"

const API = "/api/v3"
const JSON_HEADERS = { "Content-Type": "application/json" }

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

/** Public read for the server-rendered board. Null means the API did not answer, which is not an empty board. */
export async function getTrackerTasks(): Promise<TrackerTask[] | null> {
  try {
    const res = await fetch(`${serverApiUrl()}/v3/tracker`, { cache: "no-store", signal: AbortSignal.timeout(5000) })
    if (!res.ok) return null
    const json = await res.json()
    return (json.data ?? []) as TrackerTask[]
  } catch {
    return null
  }
}

type CreateInput = { title: string; description?: string; status?: TrackerStatus; priority?: string; type?: string }
type UpdateInput = Partial<Pick<TrackerTask, "title" | "description" | "status" | "priority" | "type" | "order">>

/** One tracker write through the same-origin proxy. */
async function send<T>(path: string, method: "POST" | "PATCH" | "DELETE", body?: unknown): Promise<T> {
  const res = await fetch(`${API}/tracker${path}`, {
    method,
    headers: JSON_HEADERS,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })
  const json = await res.json().catch(() => null)
  if (!res.ok || json?.status >= 400) throw new Error(`Tracker request failed (${res.status})`)
  return json?.data as T
}

/** Adds a card. */
export const createTrackerTaskClient = (input: CreateInput) => send<TrackerTask>("", "POST", input)

/** Changes a card. */
export const updateTrackerTaskClient = (id: string, input: UpdateInput) =>
  send<TrackerTask>(`/${encodeURIComponent(id)}`, "PATCH", input)

export async function deleteTrackerTaskClient(id: string): Promise<void> {
  await send(`/${encodeURIComponent(id)}`, "DELETE")
}
