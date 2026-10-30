import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// The fontSize keys in tailwind.config.ts; unregistered, twMerge reads `text-caption` as a colour and drops it.
const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: ["caption", "small", "body", "prose", "lead", "h4", "h3", "h2", "h1", "display", "numeral"] }] } },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** The URL when it is http(s), else null: links from data must never become `javascript:` hrefs. */
export function httpUrl(value?: string | null) {
  if (!value) return null
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null
  } catch {
    return null
  }
}

// Same-origin paths only. Resolve like the browser does: it treats "//host" and "/\host" as
// protocol-relative and strips tab/CR/LF, so "/\t/host" also leaves the site. Dot segments can
// also collapse into "//host" ("/.//host"), so the resolved path is checked again.
export function safeRedirect(path: string | null | undefined, fallback = "/") {
  if (!path?.startsWith("/")) return fallback
  try {
    const url = new URL(path, "http://x")
    const out = url.pathname + url.search + url.hash
    return url.origin === "http://x" && !out.startsWith("//") ? out : fallback
  } catch {
    return fallback
  }
}
