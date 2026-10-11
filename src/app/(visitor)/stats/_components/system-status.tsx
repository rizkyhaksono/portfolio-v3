"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { getHealth, type HealthData, type HealthService, type ServiceStatus } from "@/services/visitor/health"
import { MacWindow } from "@/components/ui/mac-window"
import { SectionHeading } from "@/components/ui/section-heading"
import { Surface } from "@/components/ui/surface"
import { cn } from "@/lib/utils"
import { Activity, RefreshCw, Loader2 } from "lucide-react"

const DOT: Record<ServiceStatus, string> = {
  operational: "bg-green-500",
  degraded: "bg-amber-500",
  down: "bg-red-500",
}
const LABEL: Record<ServiceStatus, string> = {
  operational: "Operational",
  degraded: "Degraded",
  down: "Down",
}

/**
 * Top banner summarizing overall system health.
 */
function OverallBanner({
  overall,
  loading,
  onRefresh,
}: Readonly<{
  overall: ServiceStatus
  loading: boolean
  onRefresh: () => void
}>) {
  return (
    <Surface variant="solid" className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span aria-hidden="true" className={cn("h-3 w-3 shrink-0 rounded-full", DOT[overall])} />
        <div className="min-w-0">
          <p className="font-semibold">
            {loading
              ? "Checking system health"
              : overall === "operational"
              ? "All systems operational"
              : overall === "degraded"
                ? "Some systems are degraded"
                : "Systems unavailable"}
          </p>
          <p className="text-xs text-muted-foreground">Live API and dependency health</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onRefresh}
        disabled={loading}
        className="flex min-h-9 items-center justify-center gap-1.5 border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-wait disabled:opacity-60 sm:min-h-0"
        aria-label="Refresh"
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
        Refresh
      </button>
    </Surface>
  )
}

/**
 * Single dependency row inside the status window.
 */
function ServiceRow({ service }: Readonly<{ service: HealthService }>) {
  const statusClass =
    service.status === "operational"
      ? "text-green-600 dark:text-green-400"
      : service.status === "down"
        ? "text-red-600 dark:text-red-400"
        : "text-amber-600 dark:text-amber-400"

  return (
    <Surface variant="inset" className="flex min-w-0 flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span aria-hidden="true" className={cn("h-2.5 w-2.5 shrink-0 rounded-full", DOT[service.status])} />
        <div className="min-w-0 leading-tight">
          <p className="break-words text-sm font-medium">{service.name}</p>
          {service.detail && <p className="break-words text-[11px] text-muted-foreground">{service.detail}</p>}
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-between gap-3 pl-5 text-xs sm:justify-end sm:pl-0">
        {service.latencyMs != null && <span className="text-muted-foreground">{service.latencyMs}ms</span>}
        <span className={cn("font-medium", statusClass)}>{LABEL[service.status]}</span>
      </div>
    </Surface>
  )
}

/**
 * Live health of the portfolio API and dependencies (embedded under /stats).
 * AI (Gemini) "not configured" means GENERATIVE_AI_API_KEY is missing on the
 * API host (Portainer). Do not add that key to Azure frontend App Settings.
 */
export default function SystemStatus() {
  const [data, setData] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)
  const requestId = useRef(0)

  const load = useCallback(async () => {
    const currentRequest = ++requestId.current
    setLoading(true)
    const d = await getHealth()
    if (currentRequest !== requestId.current) return
    setData(d)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(load, 30000)
    return () => {
      clearInterval(id)
      requestId.current += 1
    }
  }, [load])

  const hasApiService = data?.services.some((service) => service.name.toLowerCase() === "api") ?? false
  const services: HealthService[] = data
    ? hasApiService
      ? data.services
      : [{ name: "API", status: data.overall, latencyMs: null }, ...data.services]
    : loading
      ? []
      : [{ name: "API", status: "down", latencyMs: null, detail: "unreachable" }]
  const overall: ServiceStatus = data?.overall ?? (loading ? "degraded" : "down")

  const eyebrow: ReactNode = (
    <>
      <Activity className="h-3.5 w-3.5 text-primary" />
      Monitoring
    </>
  )

  return (
    <section className="w-full" aria-label="System status">
      <SectionHeading
        as="h2"
        className="mb-4"
        eyebrow={eyebrow}
        title="System"
        accent="status"
        description="Live health of the portfolio API and its dependencies."
      />

      <MacWindow title="~/status" bodyClassName="space-y-4">
        <OverallBanner overall={overall} loading={loading} onRefresh={load} />
        {loading && services.length === 0 ? (
          <Surface variant="inset" className="flex items-center gap-3 px-4 py-5 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking services...
          </Surface>
        ) : (
          <div className="grid gap-2 md:grid-cols-2">
            {services.map((service, index) => (
              <ServiceRow key={`${service.name}-${index}`} service={service} />
            ))}
          </div>
        )}
        {data?.checkedAt && (
          <p className="text-right text-[11px] text-muted-foreground">
            Last checked {new Date(data.checkedAt).toLocaleTimeString()} · auto-refreshes every 30s
          </p>
        )}
      </MacWindow>
    </section>
  )
}
