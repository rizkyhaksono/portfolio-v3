/** Hosts next/image may fetch and resize; next.config builds `images.remotePatterns` from this list. */
export const OPTIMIZED_IMAGE_HOSTS = [
  // DEV.to covers, comment avatars and article-body images
  "media2.dev.to",
  "dev-to-uploads.s3.amazonaws.com",
  "dev-to-uploads.s3.us-east-2.amazonaws.com",
  // Medium feed thumbnails and admin-entered onsite blog covers
  "cdn-images-1.medium.com",
  "miro.medium.com",
  "img-s-msn-com.akamaized.net",
  // Education logos (Supabase `education` table)
  "encrypted-tbn0.gstatic.com",
  "images.icon-icons.com",
  "media.licdn.com",
  // Signup illustration, roadmap images
  "i.pinimg.com",
  "images.unsplash.com",
] as const

export const SUPABASE_STORAGE_PATH = "/storage/v1/object/"

const hostOf = (url?: string) => {
  try {
    return url ? new URL(url).hostname : undefined
  } catch {
    return undefined
  }
}

/** This site's own Supabase project, the only one whose storage the optimizer reads. */
export const SUPABASE_IMAGE_HOST = hostOf(process.env.NEXT_PUBLIC_SUPABASE_URL)

/**
 * Whether next/image may fetch and resize `src`. Anything else renders `unoptimized`: the site's own
 * `/api/og` cards are final PNGs, and an unlisted host would turn the optimizer into an open proxy.
 */
export function canOptimizeImage(src: string | null | undefined): boolean {
  if (!src) return false
  try {
    const url = new URL(src)
    if (url.protocol !== "https:") return false
    if (url.hostname === SUPABASE_IMAGE_HOST) return url.pathname.startsWith(SUPABASE_STORAGE_PATH)
    return (OPTIMIZED_IMAGE_HOSTS as readonly string[]).includes(url.hostname)
  } catch {
    return false
  }
}
