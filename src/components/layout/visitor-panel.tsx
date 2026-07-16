"use client"

import { useEffect, useState } from "react"
import Typography from "@/components/ui/typography"
import { Surface } from "@/components/ui/surface"
import { MdWifi as IpIcon, MdLocationOn, MdDevices } from "react-icons/md"
import { BiCalendar, BiGlobe } from "react-icons/bi"
import { getBrowserInfo, getWeatherEmoji } from "@/commons/constants/sidebar"

interface IpInfo {
  ip: string
  city?: string
  country?: string
  lat?: number
  lon?: number
}

interface Weather {
  name?: string
  main?: { temp?: number; feels_like?: number; humidity?: number }
  weather?: Array<{ main: string; description: string; icon: string }>
}

/** Resolve the *visitor's* public IP + approximate location from the browser (so we never
 * expose the app host's IP). Tries ipapi.co, falls back to ipwho.is. */
async function fetchIpInfo(): Promise<IpInfo | null> {
  try {
    const r = await fetch("https://ipapi.co/json/")
    if (r.ok) {
      const d = await r.json()
      if (d?.ip && !d.error) return { ip: d.ip, city: d.city, country: d.country_name, lat: d.latitude, lon: d.longitude }
    }
  } catch {
    /* try fallback */
  }
  try {
    const r = await fetch("https://ipwho.is/")
    if (r.ok) {
      const d = await r.json()
      if (d?.ip && d.success !== false) return { ip: d.ip, city: d.city, country: d.country, lat: d.latitude, lon: d.longitude }
    }
  } catch {
    /* give up */
  }
  return null
}

export default function VisitorPanel() {
  const [ipInfo, setIpInfo] = useState<IpInfo | null>(null)
  const [weather, setWeather] = useState<Weather | null>(null)
  const [ua, setUa] = useState("")

  useEffect(() => {
    setUa(navigator.userAgent)
    let active = true
    ;(async () => {
      const info = await fetchIpInfo()
      if (!active) return
      setIpInfo(info)
      if (info?.lat != null && info?.lon != null) {
        const w = await fetch(`/api/weather?lat=${info.lat}&lon=${info.lon}`)
          .then((r) => (r.ok ? r.json() : null))
          .catch(() => null)
        if (active && w && !w.error) setWeather(w)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  const temperature = weather?.main?.temp != null ? Math.round(weather.main.temp - 273.15) : null
  const feelsLike = weather?.main?.feels_like != null ? Math.round(weather.main.feels_like - 273.15) : null
  const cond = weather?.weather?.[0]
  const emoji = cond ? getWeatherEmoji(cond.main, cond.icon) : "🌤️"
  const locationLabel = ipInfo ? [ipInfo.city, ipInfo.country].filter(Boolean).join(", ") || "Unknown" : "Detecting…"
  const weatherCity = weather?.name ?? ipInfo?.city ?? "Your area"

  return (
    <>
      <Surface variant="inset" padding="compact">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          <Typography.P className="text-sm font-semibold text-primary/80">Visitor Info</Typography.P>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <IpIcon size={14} className="text-primary/60" />
              <Typography.P className="text-xs text-primary/70">IP Address</Typography.P>
            </div>
            <div className="overflow-hidden bg-secondary/30 px-2 py-1">
              <Typography.P className="break-all font-mono text-xs text-primary/90">{ipInfo?.ip ?? "Detecting…"}</Typography.P>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MdDevices size={14} className="text-primary/60" />
              <Typography.P className="text-xs text-primary/70">Browser</Typography.P>
            </div>
            <div className="bg-secondary/30 px-2 py-1">
              <Typography.P className="truncate text-xs text-primary/90">{ua ? getBrowserInfo(ua) : "Detecting…"}</Typography.P>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MdLocationOn size={14} className="text-primary/60" />
              <Typography.P className="text-xs text-primary/70">Location</Typography.P>
            </div>
            <div className="bg-secondary/30 px-2 py-1">
              <Typography.P className="text-xs text-primary/90">{locationLabel}</Typography.P>
            </div>
          </div>
        </div>
      </Surface>

      <Surface variant="inset" padding="compact">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <Typography.P className="text-sm font-semibold text-primary/80">Status</Typography.P>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BiCalendar size={14} className="text-primary/60" />
            <Typography.P className="text-xs text-primary/70">Available for work</Typography.P>
          </div>
          <div className="flex items-center gap-2">
            <MdDevices size={14} className="text-primary/60" />
            <Typography.P className="text-xs text-primary/70">Building cool stuff</Typography.P>
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-green-500/20 bg-green-500/10 p-2">
          <Typography.P className="text-xs text-green-600 dark:text-green-400">Open to opportunities</Typography.P>
        </div>
      </Surface>

      <Surface variant="inset" padding="compact">
        <div className="mb-3 flex items-center gap-2">
          <BiGlobe size={16} className="text-muted-foreground" />
          <Typography.P className="text-sm font-semibold text-primary/80">Weather</Typography.P>
        </div>

        {weather ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{emoji}</div>
              <div>
                <Typography.P className="text-lg font-bold text-primary">{temperature !== null ? `${temperature}°C` : "N/A"}</Typography.P>
                <Typography.P className="text-xs text-primary/60">{weatherCity}</Typography.P>
              </div>
            </div>
            <div className="text-right">
              <Typography.P className="text-xs capitalize text-primary/70">{cond?.description ?? "Unknown"}</Typography.P>
              <Typography.P className="text-xs text-primary/60">{feelsLike !== null ? `Feels like ${feelsLike}°` : ""}</Typography.P>
              {weather.main?.humidity != null && <Typography.P className="text-xs text-primary/60">Humidity {weather.main.humidity}%</Typography.P>}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-4">
            <Typography.P className="text-xs text-primary/60">Detecting your local weather…</Typography.P>
          </div>
        )}
      </Surface>
    </>
  )
}
