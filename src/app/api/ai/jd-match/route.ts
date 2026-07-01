import { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

/** Public proxy for the recruiter JD-fit matcher — forwards the visitor IP for rate-limiting. */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body?.jobDescription) {
    return Response.json({ message: "Job description is required." }, { status: 400 })
  }

  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) {
    return Response.json({ message: "AI service is not configured." }, { status: 503 })
  }
  const fwd = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? ""

  try {
    const res = await fetch(`${apiUrl}/v3/ai/jd-fit`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(fwd ? { "x-forwarded-for": fwd } : {}) },
      body: JSON.stringify({ jobDescription: body.jobDescription }),
    })
    const text = await res.text()
    return new Response(text, { status: res.status, headers: { "Content-Type": "application/json" } })
  } catch {
    return Response.json({ message: "Could not reach the AI service. Please try again." }, { status: 502 })
  }
}
