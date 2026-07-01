import { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

/** Public proxy for feedback submission — forwards the visitor IP for backend rate-limiting. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body?.message) {
    return Response.json({ message: "Message is required." }, { status: 400 })
  }

  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) {
    return Response.json({ message: "Service is not configured." }, { status: 503 })
  }
  const fwd = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? ""

  try {
    const res = await fetch(`${apiUrl}/v3/feedback`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(fwd ? { "x-forwarded-for": fwd } : {}) },
      body: JSON.stringify(body),
    })
    const text = await res.text()
    return new Response(text, { status: res.status, headers: { "Content-Type": "application/json" } })
  } catch {
    return Response.json({ message: "Could not submit feedback. Please try again." }, { status: 502 })
  }
}
