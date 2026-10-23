import { STATS_PROFILES } from "@/commons/constants/stats-profiles"

export type NpmPackageStat = {
  name: string
  downloads: number
}

export type NpmStats = {
  username: string
  packageCount: number
  totalDownloadsLastMonth: number
  topPackages: NpmPackageStat[]
} | null

export async function getNpmStats(): Promise<NpmStats | null> {
  const username = STATS_PROFILES.npm
  // One deadline for the search and every download count, so the whole fan-out ends in five seconds.
  const signal = AbortSignal.timeout(5000)

  try {
    const searchRes = await fetch(
      `https://registry.npmjs.org/-/v1/search?text=maintainer:${encodeURIComponent(username)}&size=20`,
      { next: { revalidate: 3600 }, signal },
    )

    if (!searchRes.ok) return null

    const searchData = await searchRes.json()
    const objects = searchData.objects ?? []

    if (objects.length === 0) {
      return { username, packageCount: 0, totalDownloadsLastMonth: 0, topPackages: [] }
    }

    const settled = await Promise.all(
      objects.slice(0, 10).map(async (obj: { package?: { name?: string } }): Promise<NpmPackageStat | null> => {
        const name = obj?.package?.name
        if (!name) return null
        try {
          const dlRes = await fetch(`https://api.npmjs.org/downloads/point/last-month/${encodeURIComponent(name)}`, {
            next: { revalidate: 3600 },
            signal,
          })
          if (!dlRes.ok) return { name, downloads: 0 }
          const dlData = await dlRes.json().catch(() => null)
          return { name, downloads: dlData?.downloads ?? 0 }
        } catch {
          return { name, downloads: 0 }
        }
      }),
    )
    const packages: NpmPackageStat[] = settled.filter((p): p is NpmPackageStat => p !== null)

    packages.sort((a, b) => b.downloads - a.downloads)

    return {
      username,
      packageCount: searchData.total ?? objects.length,
      totalDownloadsLastMonth: packages.reduce((sum, p) => sum + p.downloads, 0),
      topPackages: packages.slice(0, 3),
    }
  } catch {
    return null
  }
}
