import { cn } from "@/lib/utils"

interface PlateFigureProps {
  /** The image (next/image or img). Sized by the caller so the frame reserves its space. */
  children: React.ReactNode
  caption?: React.ReactNode
  className?: string
  /** `photo` prints in grayscale; `color` keeps the picture's own colour (brand cards, sprites, the user's upload). */
  tone?: "photo" | "color"
}

/** Two 1.5px bars, 10px long, drawn as the `before` and `after` of a corner span. */
const MARK =
  "absolute size-[10px] before:absolute before:h-[1.5px] before:w-full before:bg-mark after:absolute after:h-full after:w-[1.5px] after:bg-mark"

const CORNERS = {
  tl: "left-1 top-1 before:left-0 before:top-0 after:left-0 after:top-0",
  tr: "right-1 top-1 before:right-0 before:top-0 after:right-0 after:top-0",
  bl: "bottom-1 left-1 before:bottom-0 before:left-0 after:bottom-0 after:left-0",
  br: "bottom-1 right-1 before:bottom-0 before:right-0 after:bottom-0 after:right-0",
} as const

/** Orange L-ticks inset 4px in the corners of the nearest `relative` frame, so nothing overflows it. */
function CropMarks() {
  return (Object.keys(CORNERS) as (keyof typeof CORNERS)[]).map((corner) => (
    <span key={corner} aria-hidden data-crop={corner} className={cn(MARK, CORNERS[corner])} />
  ))
}

/** A figure framed like a drawing: 1px ink border, orange crop marks in the gutter, photos in grayscale, caption.
 * The frame is the plate's own, so an `img` inside never takes `.prose img`'s rule border as well.
 * The photo clips its own focus outline, so the frame draws it when a control inside is focused. */
export function PlateFigure({ children, caption, className, tone = "photo" }: Readonly<PlateFigureProps>) {
  return (
    <figure className={className}>
      <div className="relative border border-ink p-2 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring">
        <div className={cn("overflow-hidden [&_img]:block [&_img]:border-0", tone === "photo" && "plate")}>{children}</div>
        <CropMarks />
      </div>
      {caption && <figcaption className="mt-2 font-display text-caption text-ink-soft">{caption}</figcaption>}
    </figure>
  )
}

export default PlateFigure
