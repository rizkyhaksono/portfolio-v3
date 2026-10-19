import { X } from "lucide-react"

/** A form-level message from the server, set like a field error: italic ink with a cross, announced on change. */
export function FormAlert({ children }: Readonly<{ children?: React.ReactNode }>) {
  if (!children) return null
  return (
    <p role="alert" className="flex items-start gap-1.5 font-display text-small text-ink">
      <X className="mt-[0.2em] size-4 shrink-0" strokeWidth={1.5} aria-hidden />
      {children}
    </p>
  )
}
