import { NextRequest } from "next/server"
import { z } from "zod"
import { serverApiUrl } from "@/lib/api-base"
import { readJson } from "@/lib/read-json"
import { getSessionToken } from "@/lib/session"
import { apiProxyHeaders } from "@/lib/trusted-client-ip"

export const dynamic = "force-dynamic"

const ChatBody = z.object({
  text: z.string().trim().min(1).max(4000),
  chatId: z.string().regex(/^[\w-]{1,64}$/).optional(),
})

/**
 * Streaming proxy for Etan AI. Reads the httpOnly session cookie server-side,
 * forwards to the backend `/v3/ai`, and passes the streamed response straight
 * through to the client as it is written.
 */
export async function POST(req: NextRequest) {
  const token = await getSessionToken()
  if (!token) {
    return Response.json({ message: "Authentication required." }, { status: 401 })
  }

  const body = await readJson(req, ChatBody, 32_000)
  if (!body.ok) {
    return Response.json({ message: "Write a message of up to 4,000 characters." }, { status: body.status })
  }

  const apiUrl = serverApiUrl()
  if (!apiUrl) {
    return Response.json({ message: "AI service is not configured." }, { status: 503 })
  }

  // Time out only the wait for headers; the stream after that can legitimately run longer.
  const headersTimeout = new AbortController()
  const timer = setTimeout(() => headersTimeout.abort(), 90_000)
  let backendRes: Response
  try {
    backendRes = await fetch(`${apiUrl}/v3/ai`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...apiProxyHeaders(req.headers),
      },
      body: JSON.stringify(body.data),
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
