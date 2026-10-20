import type { CSSProperties } from "react"

import { cn } from "@/lib/utils"

const PLATE_LABEL = "A rider on a country road, after Wenceslaus Hollar, 1650"
const PRESS_LABEL = "A printing workshop with the press, after Jan van der Straet, c. 1600"

// The Hollar plate is ~2.35:1 with the rider at about 63% across, in the lower half.
// Each crop reserves its box up front (no CLS) and aims the `.engraving` mask with --pos.
const CROPS = {
  // The floor only bites below ~770px wide; on phones it yields to 18svh so the band does not fill the screen.
  band: { "--pos": "62% 100%", aspectRatio: "100 / 26", minHeight: "min(200px, 18svh)", maxHeight: 440 },
  riders: { "--pos": "80% 50%", aspectRatio: "4 / 3" },
  // Its own plate (`.engraving-press`), already cropped by scripts/engrave.mjs: the box is the whole plate.
  press: { aspectRatio: "1870 / 2300" },
} as const

export type EngravingCrop = keyof typeof CROPS

interface EngravingProps {
  crop: EngravingCrop
  className?: string
  /** Decorative (aria-hidden) unless set; `true` uses the plate's own description. */
  label?: boolean | string
}

export function Engraving({ crop, className, label }: EngravingProps) {
  const isPress = crop === "press"
  const a11y = label
    ? { role: "img", "aria-label": typeof label === "string" ? label : isPress ? PRESS_LABEL : PLATE_LABEL }
    : { "aria-hidden": true }

  return (
    <div
      className={cn("engraving w-full", isPress && "engraving-press", className)}
      style={CROPS[crop] as CSSProperties}
      {...a11y}
    />
  )
}
