import { NextRequest } from "next/server"

/**
 * Client IP for backend rate limits. Never trust a raw X-Forwarded-For from the
 * browser — attackers spoof the first hop. Prefer Cloudflare / Azure headers,
 * otherwise the last hop (appended by the reverse proxy).
 */
export function trustedClientIp(req: NextRequest): string {
  const cf = req.headers.get("cf-connecting-ip")?.trim()
  if (cf) return cf

  const azure =
    req.headers.get("x-azure-clientip")?.trim() || req.headers.get("x-client-ip")?.trim()
  if (azure) return azure

  const xff = req.headers.get("x-forwarded-for")
  if (xff) {
    const hops = xff.split(",").map((h) => h.trim()).filter(Boolean)
    const last = hops[hops.length - 1]
    if (last) return last
  }

  return req.headers.get("x-real-ip")?.trim() ?? ""
}

/** Headers to send to the API so getClientIp() sees a proxy-trusted address. */
export function trustedClientIpHeaders(req: NextRequest): Record<string, string> {
  const ip = trustedClientIp(req)
  if (!ip) return {}
  return { "x-real-ip": ip, "x-forwarded-for": ip }
}
