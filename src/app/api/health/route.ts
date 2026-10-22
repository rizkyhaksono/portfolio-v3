import { NextResponse } from "next/server"
import { serverApiUrl } from "@/lib/api-base"

export const dynamic = "force-dynamic"

const downNow = (detail: string) =>
  NextResponse.json({
    data: { overall: "down", services: [{ name: "API", status: "down", latencyMs: null, detail }], checkedAt: new Date().toISOString() },
  })

/** Proxy to the backend health probe, shared by every open /stats tab for 15 seconds. Unreachable means down. */
export async function GET() {
  const apiUrl = serverApiUrl()
  if (!apiUrl) return downNow("Not configured")

  try {
    const res = await fetch(`${apiUrl}/v3/health`, { next: { revalidate: 15 }, signal: AbortSignal.timeout(5000) })
    const text = await res.text()
    return new Response(text, { status: res.status, headers: { "Content-Type": "application/json" } })
  } catch {
    return downNow("Unreachable")
  }
}
