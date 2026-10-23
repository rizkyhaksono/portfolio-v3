import { NextResponse } from "next/server";
import { serverApiUrl } from "@/lib/api-base";

export const dynamic = "force-dynamic";

/** Up or down only; the API's own ping body describes the caller and is not repeated here. */
export async function GET() {
  const ok = await fetch(`${serverApiUrl()}/ping`, { cache: "no-store", signal: AbortSignal.timeout(4000) })
    .then((response) => response.ok)
    .catch(() => false);
  return NextResponse.json({ ok }, { status: ok ? 200 : 503 });
}
