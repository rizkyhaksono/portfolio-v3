import { X } from "lucide-react"
import { cn } from "@/lib/utils"

/** Inline error: italic ink with a cross, never colour. */
export function ErrorNote({ children, className }: Readonly<{ children: React.ReactNode; className?: string }>) {
  return (
    <p role="alert" className={cn("flex items-start gap-2 font-display text-small text-ink", className)}>
      <X className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} aria-hidden />
      <span>{children}</span>
    </p>
  )
}
