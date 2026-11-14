"use client"

import { useEffect, useState } from "react"
import { skyPhase } from "@/lib/malang-time"
import { cn } from "@/lib/utils"

const PAUSED_KEY = "sky-paused"

// Deterministic blade heights, so the server and the client draw the same grass.
const BLADES = Array.from({ length: 180 }, (_, i) => {
  const x = (i / 179) * 1440
  const h = 10 + 9 * Math.abs(Math.sin(i * 12.9898)) + 5 * Math.abs(Math.sin(i * 3.7))
  const lean = 4 * Math.sin(i * 1.7)
  return `M${x.toFixed(1)} 300 Q${(x + lean * 0.5).toFixed(1)} ${(300 - h * 0.6).toFixed(1)} ${(x + lean).toFixed(1)} ${(300 - h).toFixed(1)} Q${(x + 2 + lean * 0.4).toFixed(1)} ${(300 - h * 0.5).toFixed(1)} ${(x + 3.5).toFixed(1)} 300 Z`
}).join(" ")

/** Malang's phase of day, refreshed every five minutes; "day" on the server so the first paint never flashes. */
function usePhase() {
  const [phase, setPhase] = useState("day")
  useEffect(() => {
    const update = () => setPhase(skyPhase(new Date()))
    update()
    const id = window.setInterval(update, 5 * 60 * 1000)
    return () => window.clearInterval(id)
  }, [])
  return phase
}

/**
 * Langit Malang: the painted landscape of the home page's Notion cover (`variant="cover"`). Back to front: a sky that follows the hour in Malang
 * (dark mode is the night sky), the sun or the moon, drifting clouds, Arjuno and Semeru in haze, the name set
 * large between the far and near hills, then grass that moves in the wind, under a fine grain like a printed photo.
 * CSS and inline SVG only; decorative, so hidden from assistive tech.
 */
export function Sky({ className, variant = "band" }: Readonly<{ className?: string; variant?: "band" | "cover" }>) {
  const phase = usePhase()

  return (
    <div aria-hidden data-print-hide data-sky={phase} className={cn("sky", variant === "cover" && "sky--cover", className)}>
      <span className="sky__orb" />
      <span className="sky__star" style={{ left: "8%", top: "16%" }} />
      <span className="sky__star" style={{ left: "21%", top: "34%" }} />
      <span className="sky__star" style={{ left: "37%", top: "12%" }} />
      <span className="sky__star" style={{ left: "52%", top: "28%" }} />
      <span className="sky__star" style={{ left: "66%", top: "9%" }} />
      <span className="sky__star" style={{ left: "88%", top: "36%" }} />
      <span className="sky__star" style={{ left: "94%", top: "14%" }} />

      <div className="sky__clouds">
        <span className="sky__cloud sky__cloud--a" />
        <span className="sky__cloud sky__cloud--b" />
        <span className="sky__cloud sky__cloud--c" />
      </div>

      <svg className="sky__back" viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax slice">
        {/* Arjuno's long ridge on the left, Semeru's cone on the right, as seen from the city. */}
        <path
          className="sky__mountain"
          d="M0 214 C 120 196, 210 150, 300 128 C 360 114, 400 122, 450 140 C 520 166, 600 186, 700 196 C 790 206, 860 188, 930 160 L 1040 92 C 1052 86, 1064 86, 1076 92 L 1190 162 C 1260 196, 1350 206, 1440 210 L 1440 300 L 0 300 Z"
        />
        <path className="sky__hill sky__hill--far" d="M0 238 C 180 206, 340 204, 520 224 S 880 262, 1080 230 S 1340 198, 1440 214 L 1440 300 L 0 300 Z" />
      </svg>

      {variant === "band" && <p className="sky__wordmark">rizkyhaksono</p>}

      <svg className="sky__front" viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax slice">
        <path className="sky__hill sky__hill--mid" d="M0 252 C 220 222, 420 230, 640 250 S 1020 280, 1220 248 S 1400 230, 1440 236 L 1440 300 L 0 300 Z" />
        <g className="sky__grass">
          <path className="sky__hill sky__hill--near" d="M0 282 C 260 262, 520 268, 760 280 S 1180 292, 1440 276 L 1440 300 L 0 300 Z" />
          <path className="sky__blades" d={BLADES} />
        </g>
      </svg>

      <span className="sky__grain" />
    </div>
  )
}

/** The hour in Malang, so the colour of the sky above has a reason. Empty until mount (the server has no clock to match). */
export function MalangClock({ className }: Readonly<{ className?: string }>) {
  const [time, setTime] = useState("")
  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jakarta" })
    const update = () => setTime(format.format(new Date()))
    update()
    const id = window.setInterval(update, 30 * 1000)
    return () => window.clearInterval(id)
  }, [])
  return <span className={cn("tabular-nums", className)}>{time ? `${time} in Malang` : " "}</span>
}

/** Pauses and plays the clouds and the grass; the choice is kept for the next visit. Hidden where nothing moves. */
export function SkyToggle({ className }: Readonly<{ className?: string }>) {
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    let stored = false
    try {
      stored = localStorage.getItem(PAUSED_KEY) === "1"
    } catch {}
    setPaused(stored)
    document.documentElement.toggleAttribute("data-sky-paused", stored)
  }, [])

  const toggle = () => {
    const next = !paused
    setPaused(next)
    document.documentElement.toggleAttribute("data-sky-paused", next)
    try {
      localStorage.setItem(PAUSED_KEY, next ? "1" : "0")
    } catch {}
  }

  return (
    <button type="button" onClick={toggle} className={cn("sky-toggle", className)}>
      {paused ? "Play the sky" : "Pause the sky"}
    </button>
  )
}

/** Notion's page cover, painted: the sky across the top of the page, 30% of the viewport tall. */
export function SkyCover() {
  return (
    <div data-print-hide className="relative isolate h-[30vh] max-h-80 min-h-44 overflow-hidden">
      <Sky variant="cover" />
      {/* Not shown on screen, reachable by keyboard and screen readers (WCAG 2.2.2). */}
      <SkyToggle className="sr-only left-4 top-4 rounded-md bg-background text-small text-foreground focus-visible:not-sr-only focus-visible:absolute focus-visible:px-2 focus-visible:py-1" />
    </div>
  )
}
