import { cn } from "@/lib/utils"

interface EyebrowProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** Optional leading marker, e.g. a step number "3" rendered before the label. */
  marker?: React.ReactNode
}

/**
 * Monospace uppercase micro-label used above section headings, on chips, stat
 * labels, and footer columns — the signature "eyebrow" of the Sapa design language.
 */
export function Eyebrow({ marker, className, children, ...props }: Readonly<EyebrowProps>) {
  return (
    <p
      className={cn(
        "flex items-center gap-2 font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground",
        className,
      )}
      {...props}
    >
      {marker != null && <span className="font-display text-base font-bold not-italic tracking-normal text-primary">{marker}</span>}
      {children}
    </p>
  )
}

export default Eyebrow
