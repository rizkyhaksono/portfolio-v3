export type ReactionTarget = "blog" | "project"

export interface ReactionState {
  count: number
  reacted: boolean
}

export async function getReactions(targetType: ReactionTarget, targetId: string): Promise<ReactionState> {
  try {
    const res = await fetch(`/api/reactions?targetType=${targetType}&targetId=${encodeURIComponent(targetId)}`, { cache: "no-store" })
    const json = await res.json().catch(() => null)
    if (!res.ok || !json?.data) return { count: 0, reacted: false }
    return json.data as ReactionState
  } catch {
    return { count: 0, reacted: false }
  }
}

export async function addReaction(targetType: ReactionTarget, targetId: string): Promise<ReactionState> {
  const res = await fetch("/api/reactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ targetType, targetId }),
  })
  const json = await res.json().catch(() => null)
  if (!res.ok || json?.status >= 400) throw new Error(json?.message || `Failed (${res.status})`)
  return json.data as ReactionState
}
