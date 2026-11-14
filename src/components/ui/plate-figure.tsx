import { cn } from "@/lib/utils"

interface PlateFigureProps {
  /** The image (next/image or img). Sized by the caller so the frame reserves its space. */
  children: React.ReactNode
  caption?: React.ReactNode
  className?: string
  /** Kept for older call sites; every picture now shows in its own colours. */
  tone?: "photo" | "color"
}

/** A picture on the grey tile with soft corners. The frame draws the focus ring when a control inside is focused. */
export function PlateFigure({ children, caption, className }: Readonly<PlateFigureProps>) {
  return (
    <figure className={className}>
      <div className="overflow-hidden rounded-2xl bg-muted has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ring [&_img]:block">
        {children}
      </div>
      {caption && <figcaption className="mt-2 text-caption text-muted-foreground">{caption}</figcaption>}
    </figure>
  )
}

export default PlateFigure
