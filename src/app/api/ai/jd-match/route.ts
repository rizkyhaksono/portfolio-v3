import { NextRequest } from "next/server"
import { z } from "zod"
import { serverApiUrl } from "@/lib/api-base"
import { readJson } from "@/lib/read-json"
import { apiProxyHeaders } from "@/lib/trusted-client-ip"

export const dynamic = "force-dynamic"

const JdBody = z.object({ jobDescription: z.string().trim().min(20).max(6000) })

/** Public proxy for the recruiter JD-fit matcher — forwards a proxy-trusted IP for rate-limiting. */
export async function POST(req: NextRequest) {
  const body = await readJson(req, JdBody, 64_000)
  if (!body.ok) {
    return Response.json({ message: "Paste a job description between 20 and 6,000 characters." }, { status: body.status })
  }

  const apiUrl = serverApiUrl()
  if (!apiUrl) {
    return Response.json({ message: "AI service is not configured." }, { status: 503 })
  }

  try {
    const res = await fetch(`${apiUrl}/v3/ai/jd-fit`, {
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
