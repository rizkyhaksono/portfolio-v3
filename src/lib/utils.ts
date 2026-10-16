import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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
