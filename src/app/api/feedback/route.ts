import { NextRequest } from "next/server"
import { z } from "zod"
import { serverApiUrl } from "@/lib/api-base"
import { readJson } from "@/lib/read-json"
import { apiProxyHeaders } from "@/lib/trusted-client-ip"

export const dynamic = "force-dynamic"

const FeedbackBody = z.object({
  message: z.string().trim().min(2).max(2000),
  category: z.string().max(40).optional(),
  email: z.string().max(200).optional(),
  pageUrl: z.string().max(500).optional(),
})

/** Public proxy for feedback submission — forwards the visitor IP for backend rate-limiting. */
export async function POST(req: NextRequest) {
  const body = await readJson(req, FeedbackBody, 16_000)
  if (!body.ok) return Response.json({ message: "Write a message between 2 and 2,000 characters." }, { status: body.status })

  const apiUrl = serverApiUrl()
  if (!apiUrl) {
    return Response.json({ message: "Service is not configured." }, { status: 503 })
  }

  try {
    const res = await fetch(`${apiUrl}/v3/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...apiProxyHeaders(req.headers) },
      body: JSON.stringify(body.data),
    })
    const text = await res.text()
    return new Response(text, { status: res.status, headers: { "Content-Type": "application/json" } })
  } catch {
    return Response.json({ message: "Could not submit feedback. Please try again." }, { status: 502 })
  }
}
