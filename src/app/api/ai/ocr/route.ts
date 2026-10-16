import { NextRequest } from "next/server"
import { trustedClientIpHeaders } from "@/lib/trusted-client-ip"

export const dynamic = "force-dynamic"

// The API caps imageBase64 at 3,000,000 chars; leave room for the JSON wrapper.
const MAX_BODY_BYTES = 3_200_000

/** Public (no-auth) proxy for the Gemini-Vision document OCR / extraction demo. */
export async function POST(req: NextRequest) {
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) {
    return Response.json({ message: "Image too large. Try a smaller photo." }, { status: 413 })
  }

  const body = await req.json().catch(() => null)
  if (!body?.imageBase64 || !body?.mimeType || !body?.mode) {
    return Response.json({ message: "imageBase64, mimeType, and mode are required." }, { status: 400 })
  }

  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) {
    return Response.json({ message: "AI service is not configured." }, { status: 503 })
  }

  try {
    const res = await fetch(`${apiUrl}/v3/ai/ocr`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...trustedClientIpHeaders(req) },
      body: JSON.stringify({ imageBase64: body.imageBase64, mimeType: body.mimeType, mode: body.mode }),
      signal: AbortSignal.any([req.signal, AbortSignal.timeout(90_000)]),
    })
    const text = await res.text()
    return new Response(text, { status: res.status, headers: { "Content-Type": "application/json" } })
  } catch {
    return Response.json({ message: "Could not reach Etan AI. Try again in a minute." }, { status: 502 })
  }
}
