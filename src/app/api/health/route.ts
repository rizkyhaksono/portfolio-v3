import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

/** Proxy to the backend health probe. If the API itself is unreachable, report it as down. */
export async function GET() {
  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL
  const now = new Date().toISOString()

  if (!apiUrl) {
    return NextResponse.json({ data: { overall: "down", services: [{ name: "API", status: "down", latencyMs: null, detail: "not configured" }], checkedAt: now } })
  }

  try {
    const res = await fetch(`${apiUrl}/v3/health`, { cache: "no-store" })
    const text = await res.text()
    return new Response(text, { status: res.status, headers: { "Content-Type": "application/json" } })
  } catch {
    return NextResponse.json({ data: { overall: "down", services: [{ name: "API", status: "down", latencyMs: null, detail: "unreachable" }], checkedAt: now } })
  }
}
