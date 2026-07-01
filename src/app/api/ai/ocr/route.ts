import { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

/** Public (no-auth) proxy for the Gemini-Vision document OCR / extraction demo. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body?.imageBase64 || !body?.mimeType || !body?.mode) {
    return Response.json({ message: "imageBase64, mimeType, and mode are required." }, { status: 400 })
  }

  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL
  const fwd = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? ""

  const res = await fetch(`${apiUrl}/v3/ai/ocr`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(fwd ? { "x-forwarded-for": fwd } : {}) },
    body: JSON.stringify({ imageBase64: body.imageBase64, mimeType: body.mimeType, mode: body.mode }),
  })

  const text = await res.text()
  return new Response(text, { status: res.status, headers: { "Content-Type": "application/json" } })
}
