import { X } from "lucide-react"
import { cn } from "@/lib/utils"

/** FormMessage's error line, for forms that validate without react-hook-form. */
export function FieldMessage({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("flex items-start gap-1.5 font-display text-small text-ink", className)} {...props}>
      <X className="mt-[0.2em] size-4 shrink-0" strokeWidth={1.5} aria-hidden />
      {children}
    </p>
  )
}
