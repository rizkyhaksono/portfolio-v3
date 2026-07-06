import { cn } from "@/lib/utils"
import { Eyebrow } from "@/components/ui/eyebrow"

interface StepProps {
  n: number
  label: string
  title: React.ReactNode
  description?: React.ReactNode
  className?: string
  children?: React.ReactNode
}

/** Numbered step block: big display numeral + mono "STEP N" eyebrow + heading. */
export function Step({ n, label, title, description, className, children }: Readonly<StepProps>) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <Eyebrow marker={n}>{label}</Eyebrow>
      <h3 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h3>
      {description && <p className="max-w-md text-xs leading-relaxed text-muted-foreground sm:text-sm">{description}</p>}
      {children}
    </div>
  )
}

export default Step
