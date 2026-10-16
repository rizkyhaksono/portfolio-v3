import { cookies } from "next/headers"
import { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

/**
 * Streaming proxy for Etan AI. Reads the (httpOnly) session cookie server-side,
 * forwards to the backend `/v3/ai`, and passes the streamed response straight
 * through to the client so the answer types out like ChatGPT.
 */
export async function POST(req: NextRequest) {
  const token = (await cookies()).get("NATEE_V3_TOKEN")?.value
  if (!token) {
    return Response.json({ message: "Authentication required." }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  if (!body?.text) {
    return Response.json({ message: "Message text is required." }, { status: 400 })
  }

  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) {
    return Response.json({ message: "AI service is not configured." }, { status: 503 })
  }

  // Time out only the wait for headers; the paced stream after that can legitimately run longer.
  const headersTimeout = new AbortController()
  const timer = setTimeout(() => headersTimeout.abort(), 90_000)
  let backendRes: Response
  try {
    backendRes = await fetch(`${apiUrl}/v3/ai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        text: body.text,
        ...(body.chatId ? { chatId: body.chatId } : {}),
      }),
      signal: AbortSignal.any([req.signal, headersTimeout.signal]),
    })
  } catch {
    return Response.json({ message: "Could not reach Etan AI. Try again in a minute." }, { status: 502 })
  } finally {
    clearTimeout(timer)
  }

  const contentType = backendRes.headers.get("content-type") ?? ""

  // Errors (auth, rate limit, model failure) come back as JSON — forward as-is.
  if (!backendRes.ok || contentType.includes("application/json")) {
    const text = await backendRes.text().catch(() => "")
    return new Response(text || JSON.stringify({ message: `AI request failed (${backendRes.status})` }), {
      status: backendRes.ok ? 200 : backendRes.status,
      headers: { "Content-Type": "application/json" },
    })
  }

  // Success: stream the body straight through to the client.
  return new Response(backendRes.body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  })
}
