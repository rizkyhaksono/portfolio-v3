import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

/** Public proxy for the owner profile — lets client components (e.g. the sidebar) read it. */
export async function GET() {
  const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) return NextResponse.json({ data: null })
  try {
    const res = await fetch(`${apiUrl}/v3/profile`, { next: { revalidate: 300 } })
    const text = await res.text()
    return new Response(text, { status: res.status, headers: { "Content-Type": "application/json" } })
  } catch {
    return NextResponse.json({ data: null })
  }
}
