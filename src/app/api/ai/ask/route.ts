import { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

/** Public (no-auth) proxy for the one-shot "Ask my resume" grounded RAG answer. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body?.question) {
    return Response.json({ message: "Question is required." }, { status: 400 })
  }

  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) {
    return Response.json({ message: "AI service is not configured." }, { status: 503 })
  }
  const fwd = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? ""

  try {
    const res = await fetch(`${apiUrl}/v3/ai/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(fwd ? { "x-forwarded-for": fwd } : {}) },
      body: JSON.stringify({ question: body.question }),
    })
    const text = await res.text()
    return new Response(text, { status: res.status, headers: { "Content-Type": "application/json" } })
  } catch {
    return Response.json({ message: "Could not reach the AI service. Please try again." }, { status: 502 })
  }
}
