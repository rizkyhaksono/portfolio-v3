import { PRINT_HEX } from "@/lib/print-hex"

type Stop = readonly [at: number, hex: string]

// Gradient maps for `.plate` photos. Each ramp runs through the theme's own tokens, placed by lightness,
// so midtones print as ink (a straight ink-to-paper blend passes through neutral grey).
export const PLATE_RAMPS: Record<"plate-paper" | "plate-night", readonly Stop[]> = {
  "plate-paper": [[0, PRINT_HEX.ink], [0.16, PRINT_HEX.inkSoft], [0.79, PRINT_HEX.rule], [0.95, PRINT_HEX.paper], [1, PRINT_HEX.paper]],
  "plate-night": [[0, PRINT_HEX.night], [0.13, PRINT_HEX.nightTint], [0.8, PRINT_HEX.nightInkSoft], [0.97, PRINT_HEX.nightInk], [1, PRINT_HEX.nightInk]],
}

const STEPS = 20

const channelOf = (hex: string, channel: number) => parseInt(hex.slice(1 + channel * 2, 3 + channel * 2), 16) / 255

/** feFunc tableValues for one channel: the ramp sampled at STEPS + 1 even points. */
export function rampTable(stops: readonly Stop[], channel: number): string {
  return Array.from({ length: STEPS + 1 }, (_, k) => {
    const x = k / STEPS
    const j = Math.max(0, stops.findIndex(([at]) => at >= x) - 1)
    const [a, from] = stops[j]
    const [b, to] = stops[j + 1] ?? stops[j]
    const t = b > a ? Math.min(1, Math.max(0, (x - a) / (b - a))) : 0
    return (channelOf(from, channel) + (channelOf(to, channel) - channelOf(from, channel)) * t).toFixed(3)
  }).join(" ")
}

/** Mounted once in the root layout; globals.css points `.plate img` at these by id. */
export function PlateFilters() {
  return (
    <svg aria-hidden focusable="false" width="0" height="0" className="absolute">
      {Object.entries(PLATE_RAMPS).map(([id, stops]) => (
        <filter key={id} id={id} colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="table" tableValues={rampTable(stops, 0)} />
            <feFuncG type="table" tableValues={rampTable(stops, 1)} />
            <feFuncB type="table" tableValues={rampTable(stops, 2)} />
          </feComponentTransfer>
        </filter>
      ))}
    </svg>
  )
}
