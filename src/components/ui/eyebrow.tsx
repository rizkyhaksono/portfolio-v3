import { cn } from "@/lib/utils"

interface EyebrowProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Leading number for a real sequence only (roadmap stage, changelog version). */
  marker?: React.ReactNode
}

/** Italic caption above a heading. Use only when it tells the reader something the heading does not. */
export function Eyebrow({ marker, className, children, ...props }: Readonly<EyebrowProps>) {
  return (
    <p className={cn("font-display text-caption text-ink-soft", className)} {...props}>
      {marker != null && <span className="tabular-nums">{marker} </span>}
      {children}
    </p>
  )
}

export default Eyebrow
