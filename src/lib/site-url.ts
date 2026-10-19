/** Production canonical origin for portfolio SEO (robots, sitemap, OG, JSON-LD). */
export const CANONICAL_SITE_ORIGIN = "https://natee.my.id"

const LOCAL_DEV_ORIGIN = "http://localhost:3000"

/**
 * Resolves the public site origin from DOMAIN, falling back to CANONICAL_SITE_ORIGIN.
 * Strips trailing slashes. Warns in production if DOMAIN still points at the old domain.
 */
export function getSiteUrl(): string {
  const raw = process.env.DOMAIN?.trim()
  const normalized = raw ? raw.replace(/\/$/, "") : CANONICAL_SITE_ORIGIN

  if (
    process.env.NODE_ENV === "production" &&
    raw &&
    /nateee\.com/i.test(raw)
  ) {
    console.warn(
      "[site-url] DOMAIN still references nateee.com; set DOMAIN to https://natee.my.id in CI and Azure.",
    )
  }

  if (!raw || !/^https?:\/\//i.test(normalized)) {
    return CANONICAL_SITE_ORIGIN
  }

  return normalized
}

/**
 * Base URL for Next.js metadataBase and absolute link generation.
 */
export function getMetadataBaseUrl(): URL {
  if (process.env.NODE_ENV === "development") {
    return new URL(LOCAL_DEV_ORIGIN)
  }
  return new URL(getSiteUrl())
}

/**
 * Images this site serves itself (e.g. `/api/og` cards used as blog covers). They are already
 * final PNGs, and the image optimizer only accepts allow-listed remote hosts, so render them as-is.
 */
export function isSiteImage(src: string): boolean {
  return src.startsWith("/") || src.startsWith(`${CANONICAL_SITE_ORIGIN}/`) || src.startsWith(`${getSiteUrl()}/`)
}

/**
 * Relative URL of a generated card (`/api/og` by default). Always carries `v=2`: next/og answers with
 * `immutable, max-age=31536000`, so a changed design needs a new URL to reach shared and cached copies.
 */
export function ogImageUrl(params: Record<string, string>, path: "/api/og" | "/api/certificate" = "/api/og"): string {
  return `${path}?${new URLSearchParams({ ...params, v: "2" })}`
}
