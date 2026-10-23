"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { getHealth, type HealthData, type HealthService, type ServiceStatus } from "@/services/visitor/health"
import { PageSection } from "@/components/ui/page-section"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const POLL_MS = 60_000

// Status by shape and word, never colour: filled, dashed outline, empty outline.
const SHAPE: Record<ServiceStatus, string> = {
  operational: "border-ink bg-ink",
  degraded: "border-dashed border-ink",
  down: "border-ink",
}
const WORD: Record<ServiceStatus, string> = {
  operational: "Operational",
  degraded: "Degraded",
  down: "Down",
}
const HEADLINE: Record<ServiceStatus, string> = {
  operational: "All systems operational",
  degraded: "Some systems are degraded",
  down: "Systems unavailable",
}

const StatusMark = ({ status }: { status: ServiceStatus }) => (
  <span aria-hidden className={cn("inline-block size-2 shrink-0 border", SHAPE[status])} />
)

function ServiceRow({ service }: Readonly<{ service: HealthService }>) {
  return (
    <li className="grid gap-x-6 gap-y-1 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline">
      <div className="min-w-0">
        <p className="break-words text-body text-ink">{service.name}</p>
        {service.detail && <p className="break-words font-display text-caption text-ink-soft">{service.detail}</p>}
      </div>
      <p className="flex items-center gap-2 text-small tabular-nums text-ink-soft sm:justify-end">
        {service.latencyMs != null && <span className="mr-2">{service.latencyMs} ms</span>}
        <StatusMark status={service.status} />
        <span className="text-ink">{WORD[service.status]}</span>
      </p>
    </li>
  )
}

/** Clock time, hours and minutes, for a health check. */
const timeOf = (iso: string) => new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })

/**
 * Live health of the portfolio API and its dependencies, the `#status` strip on /stats. Checks on mount,
 * then every minute while the tab is visible. A failed check keeps the last answer on screen.
 */
export default function SystemStatus() {
  const [data, setData] = useState<HealthData | null>(null)
  const [checking, setChecking] = useState(true)
  const [failed, setFailed] = useState(false)
  const requestId = useRef(0)

  // Only the first check and a press of the button show progress; background polls change nothing until they answer.
  const load = useCallback(async (visible: boolean) => {
    const currentRequest = ++requestId.current
    if (visible) setChecking(true)
    const d = await getHealth()
    if (currentRequest !== requestId.current) return
    if (d) setData(d)
    setFailed(!d)
    setChecking(false)
  }, [])

  useEffect(() => {
    load(true)
    const id = setInterval(() => {
      if (!document.hidden) load(false)
    }, POLL_MS)
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
    : checking
      ? []
      : [{ name: "API", status: "down", latencyMs: null, detail: "Unreachable" }]
  const overall: ServiceStatus | null = data?.overall ?? (checking ? null : "down")

  return (
    <PageSection
      id="status"
      heading={{ title: "Status" }}
      contentClassName="mt-6"
    >
      <div aria-busy={checking}>
        <div className="flex flex-wrap items-center justify-between gap-4 border-y border-ink py-4">
          <p className="flex items-center gap-3 font-display text-h4 text-ink">
            {overall && <StatusMark status={overall} />}
            {overall ? HEADLINE[overall] : "Checking the services"}
          </p>
          <Button variant="outline" size="sm" onClick={() => load(true)} disabled={checking}>
            {checking ? "Checking…" : "Check again"}
          </Button>
        </div>

        {services.length > 0 && (
          <ul role="list" className="divide-y divide-rule border-b border-rule">
            {services.map((service, index) => (
              <ServiceRow key={`${service.name}-${index}`} service={service} />
            ))}
          </ul>
        )}

        {data?.checkedAt && (
          <p className="mt-3 font-display text-caption text-ink-soft">
            {failed
              ? `The last check did not reach the API, so this is the answer from ${timeOf(data.checkedAt)}.`
              : `Checked at ${timeOf(data.checkedAt)}.`}{" "}
            It checks again every minute while this page is open.
          </p>
        )}
      </div>
    </PageSection>
  )
}
