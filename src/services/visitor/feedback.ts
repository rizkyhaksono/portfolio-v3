export type FeedbackCategory = "suggestion" | "bug" | "general"

export async function submitFeedback(input: {
  message: string
  category: FeedbackCategory
  email?: string
  pageUrl?: string
}): Promise<void> {
  const res = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  const json = await res.json().catch(() => null)
  if (!res.ok || json?.status >= 400) throw new Error(json?.message || `Failed (${res.status})`)
}
