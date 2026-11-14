import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-none bg-muted", className)}
      {...props}
    />
  )
}

export { Skeleton }
