export interface OwnerProfile {
  name: string | null
  headline: string | null
  location: string | null
  about: string | null
  avatarUrl: string | null
  bannerUrl: string | null
  website: string | null
}

/** Server-side fetch of the public owner profile (for server components like the home page). */
export async function getOwnerProfile(): Promise<OwnerProfile | null> {
  try {
    const apiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL
    if (!apiUrl) return null
    const res = await fetch(`${apiUrl}/v3/profile`, { next: { revalidate: 300 } })
    const json = await res.json().catch(() => null)
    return (json?.data ?? null) as OwnerProfile | null
  } catch {
    return null
  }
}
