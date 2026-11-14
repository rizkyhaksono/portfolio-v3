/** Origin of a URL, or nothing when the value is empty or not a URL. */
const originOf = (url?: string) => {
  try {
    return url ? new URL(url).origin : undefined
  } catch {
    return undefined
  }
}

const isDev = process.env.NODE_ENV !== "production"
const umamiOrigins = [originOf(process.env.NEXT_PUBLIC_UMAMI_SRC), originOf(process.env.NEXT_PUBLIC_UMAMI_RECORDER_SRC)]
const TURNSTILE = "https://challenges.cloudflare.com"

/** CSP source list with blanks and repeats removed. */
const sources = (...list: (string | undefined)[]) => [...new Set(list.filter(Boolean))].join(" ")

/**
 * Builds a per-request Content-Security-Policy value for HTML document responses.
 * Script execution uses a nonce (set in proxy); styles stay inline-capable for Tailwind.
 */
export function buildContentSecurityPolicy(nonce: string): string {
  return [
    "default-src 'self'",
    `script-src ${sources(
      "'self'",
      `'nonce-${nonce}'`,
      "'strict-dynamic'",
      isDev ? "'unsafe-eval'" : undefined,
      ...umamiOrigins,
      TURNSTILE,
    )}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    `connect-src ${sources(
      "'self'",
      originOf(process.env.NEXT_PUBLIC_API_URL),
      originOf(process.env.NEXT_PUBLIC_SUPABASE_URL),
      ...umamiOrigins,
      "https://api.emailjs.com",
      "https://api.dictionaryapi.dev",
      TURNSTILE,
      isDev ? "ws: http://localhost:*" : undefined,
    )}`,
    "media-src 'self' blob: https:",
    `frame-src ${TURNSTILE} https://www.youtube-nocookie.com`,
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ")
}
