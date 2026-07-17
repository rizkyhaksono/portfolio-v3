import { cn } from "@/lib/utils"

interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  icon?: React.ReactNode
}

/**
 * Monospace uppercase pill tag (DOCUMENTS, AI AGENT, CLOUD API…) from the Sapa
 * design language. Use for tech tags, categories, and status labels.
 */
export function Chip({ icon, className, children, ...props }: Readonly<ChipProps>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-none border border-border/70 bg-secondary px-2 py-1 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </span>
  )
}

export default Chip
