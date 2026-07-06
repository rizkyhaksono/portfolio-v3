"use client"

import { useCallback, useEffect, useState } from "react"
import { getHealth, type HealthData, type HealthService, type ServiceStatus } from "@/services/visitor/health"
import { MacWindow } from "@/components/ui/mac-window"
import { SectionHeading } from "@/components/ui/section-heading"
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

export default function StatusPage() {
  const [data, setData] = useState<HealthData | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const d = await getHealth()
    setData(d)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(load, 30000)
    return () => clearInterval(id)
  }, [load])

  const services: HealthService[] = data
    ? [{ name: "API", status: "operational", latencyMs: null }, ...data.services]
    : [{ name: "API", status: "down", latencyMs: null, detail: "unreachable" }]
  const overall: ServiceStatus = data?.overall ?? "down"
  const allUp = overall === "operational" && services.every((s) => s.status === "operational")

  return (
    <div className="w-full px-4 lg:px-0">
      <SectionHeading
        as="h1"
        className="mb-6"
        eyebrow={
          <>
            <Activity className="h-3.5 w-3.5 text-primary" />
            Monitoring
          </>
        }
        title="System"
        accent="status"
        description="Live health of the portfolio API and its dependencies."
      />

      <MacWindow title="~/status" bodyClassName="space-y-4">
        <div
          className={cn(
            "flex items-center justify-between rounded-xl border p-4",
            allUp ? "border-green-500/30 bg-green-500/10" : "border-amber-500/30 bg-amber-500/10",
          )}
        >
          <div className="flex items-center gap-3">
            <span className={cn("h-3 w-3 rounded-full", DOT[overall])} />
            <p className="font-semibold">{allUp ? "All systems operational" : "Some systems are degraded"}</p>
          </div>
          <button
            onClick={load}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Refresh"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
            Refresh
          </button>
        </div>

        <div className="space-y-2">
          {services.map((s) => (
            <div key={s.name} className="flex items-center justify-between rounded-lg border border-border/40 bg-secondary/20 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className={cn("h-2.5 w-2.5 rounded-full", DOT[s.status])} />
                <div className="leading-tight">
                  <p className="text-sm font-medium">{s.name}</p>
                  {s.detail && <p className="text-[11px] text-muted-foreground">{s.detail}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                {s.latencyMs != null && <span className="text-muted-foreground">{s.latencyMs}ms</span>}
                <span className={cn("font-medium", s.status === "operational" ? "text-green-600 dark:text-green-400" : s.status === "down" ? "text-red-600 dark:text-red-400" : "text-amber-600 dark:text-amber-400")}>
                  {LABEL[s.status]}
                </span>
              </div>
            </div>
          ))}
        </div>

        {data?.checkedAt && (
          <p className="text-right text-[11px] text-muted-foreground">
            Last checked {new Date(data.checkedAt).toLocaleTimeString()} · auto-refreshes every 30s
          </p>
        )}
      </MacWindow>
    </div>
  )
}
