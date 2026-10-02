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
