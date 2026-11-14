import sanitizeHtml from "sanitize-html"
import { normalizeTypedBullets, SANITIZE_OPTIONS } from "./safe-html"

interface RichTextProps {
  /** Untrusted HTML from the admin, DEV or the onsite blog. */
  html: string
  className?: string
}

/**
 * The only place stored HTML reaches the page. sanitize-html runs at the sink itself, so the
 * security scanners (GuardRails / semgrep taint rules) can see that the value is cleaned.
 */
export function RichText({ html, className }: Readonly<RichTextProps>) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitizeHtml(normalizeTypedBullets(html), SANITIZE_OPTIONS) }} />
}
