import { cn } from "@/lib/utils"

interface PlateFigureProps {
  /** The image (next/image or img). Sized by the caller so the frame reserves its space. */
  children: React.ReactNode
  caption?: React.ReactNode
  className?: string
  /** `photo` prints in duotone; `color` keeps the picture's own colour (site cards, sprites, the user's upload). */
  tone?: "photo" | "color"
}

/** A photo printed as a plate: double-rule frame (1px ink, 3px paper, 1px rule), duotone, italic caption.
 * The photo clips its own focus outline, so the frame draws it when a control inside is focused. */
export function PlateFigure({ children, caption, className, tone = "photo" }: Readonly<PlateFigureProps>) {
  return (
    <figure className={className}>
      <div className="border border-ink p-[3px] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring">
        <div className={cn("overflow-hidden border border-rule [&_img]:block", tone === "photo" && "plate")}>{children}</div>
      </div>
      {caption && <figcaption className="mt-2 font-display text-caption text-ink-soft">{caption}</figcaption>}
    </figure>
  )
}

export default PlateFigure
