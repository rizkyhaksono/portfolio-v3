import { NextRequest } from "next/server"
import { z } from "zod"
import { serverApiUrl } from "@/lib/api-base"
import { readJson } from "@/lib/read-json"
import { apiProxyHeaders } from "@/lib/trusted-client-ip"

export const dynamic = "force-dynamic"

// The API caps imageBase64 at 3,000,000 chars; leave room for the JSON wrapper.
const MAX_BODY_BYTES = 3_200_000

const OcrBody = z.object({
  imageBase64: z.string().min(1).max(3_000_000),
  mimeType: z.enum(["image/png", "image/jpeg", "image/webp"]),
  mode: z.enum(["classify", "extract"]),
})

/** Public (no-auth) proxy for the Gemini-Vision document OCR / extraction demo. */
export async function POST(req: NextRequest) {
  const body = await readJson(req, OcrBody, MAX_BODY_BYTES)
  if (!body.ok) {
    return body.status === 413
      ? Response.json({ message: "Image too large. Try a smaller photo." }, { status: 413 })
      : Response.json({ message: "Send a PNG, JPG or WebP image and a mode." }, { status: 400 })
  }

  const apiUrl = serverApiUrl()
  if (!apiUrl) {
    return Response.json({ message: "AI service is not configured." }, { status: 503 })
  }

  try {
    const res = await fetch(`${apiUrl}/v3/ai/ocr`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...apiProxyHeaders(req.headers) },
      body: JSON.stringify(body.data),
      signal: AbortSignal.any([req.signal, AbortSignal.timeout(90_000)]),
    })
    const text = await res.text()
    return new Response(text, { status: res.status, headers: { "Content-Type": "application/json" } })
  } catch {
    return Response.json({ message: "Could not reach Etan AI. Try again in a minute." }, { status: 502 })
  }
}
