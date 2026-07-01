import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

function apiBase(): string | undefined {
  return process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL
}

function fwdHeader(req: NextRequest): Record<string, string> {
  const fwd = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? ""
  return fwd ? { "x-forwarded-for": fwd } : {}
}

export async function GET(req: NextRequest) {
  const apiUrl = apiBase()
  if (!apiUrl) return NextResponse.json({ data: { count: 0, reacted: false } })
  const targetType = req.nextUrl.searchParams.get("targetType") ?? ""
  const targetId = req.nextUrl.searchParams.get("targetId") ?? ""
  try {
    const res = await fetch(`${apiUrl}/v3/reactions?targetType=${encodeURIComponent(targetType)}&targetId=${encodeURIComponent(targetId)}`, {
      cache: "no-store",
      headers: { ...fwdHeader(req) },
    })
    const text = await res.text()
    return new Response(text, { status: res.status, headers: { "Content-Type": "application/json" } })
  } catch {
    return NextResponse.json({ data: { count: 0, reacted: false } })
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null)
  if (!body?.targetType || !body?.targetId) {
    return Response.json({ message: "targetType and targetId are required." }, { status: 400 })
  }
  const apiUrl = apiBase()
  if (!apiUrl) return Response.json({ message: "Service is not configured." }, { status: 503 })
  try {
    const res = await fetch(`${apiUrl}/v3/reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...fwdHeader(req) },
      body: JSON.stringify(body),
    })
    const text = await res.text()
    return new Response(text, { status: res.status, headers: { "Content-Type": "application/json" } })
  } catch {
    return Response.json({ message: "Could not react. Please try again." }, { status: 502 })
  }
}
