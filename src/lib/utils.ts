import { type ClassValue, clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// The fontSize keys in tailwind.config.ts; unregistered, twMerge reads `text-caption` as a colour and drops it.
const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: ["caption", "small", "body", "prose", "lead", "h4", "h3", "h2", "h1", "display", "numeral"] }] } },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Same-origin paths only. Resolve like the browser does: it treats "//host" and "/\host" as
// protocol-relative and strips tab/CR/LF, so "/\t/host" also leaves the site.
export function safeRedirect(path: string | null | undefined, fallback = "/") {
  if (!path?.startsWith("/")) return fallback
  try {
    const url = new URL(path, "http://x")
    return url.origin === "http://x" ? url.pathname + url.search + url.hash : fallback
  } catch {
    return fallback
  }
}
