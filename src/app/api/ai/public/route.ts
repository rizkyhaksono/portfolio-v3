import { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

/**
 * Public (no-auth) streaming proxy for the anonymous portfolio chat. Forwards the
 * client IP so the backend can rate-limit per visitor, and streams the response
 * (text + trailing `<!--meta-->` sentinel) straight through.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body?.text) {
    return Response.json({ message: "Message text is required." }, { status: 400 })
  }

  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL
  const fwd = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? ""

  const backendRes = await fetch(`${apiUrl}/v3/ai/public`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(fwd ? { "x-forwarded-for": fwd } : {}) },
    body: JSON.stringify({ text: body.text }),
  })

  const contentType = backendRes.headers.get("content-type") ?? ""
  if (!backendRes.ok || contentType.includes("application/json")) {
    const text = await backendRes.text()
    return new Response(text || JSON.stringify({ message: `AI request failed (${backendRes.status})` }), {
      status: backendRes.ok ? 200 : backendRes.status,
      headers: { "Content-Type": "application/json" },
    })
  }

  return new Response(backendRes.body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  })
}
