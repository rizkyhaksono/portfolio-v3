import { isIP } from "node:net"

type HeaderSource = Pick<Headers, "get">

/**
 * Client IP for backend rate limits. Nginx Proxy Manager is the only proxy in front of this site:
 * it overwrites X-Real-IP and appends the peer to X-Forwarded-For. Cloudflare does not front
 * natee.my.id, so cf-connecting-ip (or any first XFF hop) is whatever the browser sent.
 */
export function trustedClientIp(headers: HeaderSource): string {
  const real = headers.get("x-real-ip")?.trim()
  if (real && isIP(real)) return real

  const last = headers.get("x-forwarded-for")?.split(",").map((hop) => hop.trim()).filter(Boolean).at(-1)
  return last && isIP(last) ? last : ""
}

/**
 * Headers for server-to-server API calls made on a visitor's behalf. The API trusts x-client-ip only
 * with a matching x-internal-key; x-real-ip keeps an API without that check keyed to the visitor too.
 */
export function apiProxyHeaders(headers: HeaderSource): Record<string, string> {
  const ip = trustedClientIp(headers)
  const key = process.env.INTERNAL_PROXY_SECRET
  return {
    ...(key ? { "x-internal-key": key } : {}),
    ...(ip ? { "x-client-ip": ip, "x-real-ip": ip } : {}),
  }
}
