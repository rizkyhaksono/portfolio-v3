import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { serverApiUrl } from "@/lib/api-base"
import { readJson } from "@/lib/read-json"
import { apiProxyHeaders } from "@/lib/trusted-client-ip"

export const dynamic = "force-dynamic"

const Target = z.object({
  targetType: z.string().min(1).max(40),
  targetId: z.string().min(1).max(200),
})

const NO_REACTIONS = { data: { count: 0, reacted: false } }

export async function GET(req: NextRequest) {
  const apiUrl = serverApiUrl()
  const target = Target.safeParse({
    targetType: req.nextUrl.searchParams.get("targetType"),
    targetId: req.nextUrl.searchParams.get("targetId"),
  })
  if (!apiUrl || !target.success) return NextResponse.json(NO_REACTIONS)
  try {
    const query = new URLSearchParams(target.data)
    const res = await fetch(`${apiUrl}/v3/reactions?${query}`, {
      cache: "no-store",
      headers: apiProxyHeaders(req.headers),
    })
    const text = await res.text()
    return new Response(text, { status: res.status, headers: { "Content-Type": "application/json" } })
  } catch {
    return NextResponse.json(NO_REACTIONS)
  }
}

export async function POST(req: NextRequest) {
  const body = await readJson(req, Target, 2_000)
  if (!body.ok) return Response.json({ message: "targetType and targetId are required." }, { status: body.status })
  const apiUrl = serverApiUrl()
  if (!apiUrl) return Response.json({ message: "Service is not configured." }, { status: 503 })
  try {
    const res = await fetch(`${apiUrl}/v3/reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...apiProxyHeaders(req.headers) },
      body: JSON.stringify(body.data),
    })
    const text = await res.text()
    return new Response(text, { status: res.status, headers: { "Content-Type": "application/json" } })
  } catch {
    return Response.json({ message: "Could not react. Please try again." }, { status: 502 })
  }
}
