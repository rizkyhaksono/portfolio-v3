export type ServiceStatus = "operational" | "degraded" | "down"

export interface HealthService {
  name: string
  status: ServiceStatus
  latencyMs: number | null
  detail?: string
}

export interface HealthData {
  overall: ServiceStatus
  services: HealthService[]
  checkedAt: string
}

export async function getHealth(): Promise<HealthData | null> {
  try {
    const res = await fetch("/api/health", { cache: "no-store" })
    const json = await res.json().catch(() => null)
    if (!json?.data) return null
    return json.data as HealthData
  } catch {
    return null
  }
}
