import { NextResponse } from "next/server"
import { getActiveVisitors } from "@/services/visitor/umami"

// Never prerender: the count would freeze at build time. The service caches it for 30 s.
export const dynamic = "force-dynamic"

/** Public realtime count only; nothing else from Umami leaves the server. */
export async function GET() {
  const visitors = await getActiveVisitors().catch(() => 0)
  return NextResponse.json({ visitors })
}
