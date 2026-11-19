import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-20 w-full py-2 rounded-md border border-transparent bg-tint px-3 text-base font-normal text-foreground transition-colors duration-75 ease-out placeholder:text-muted-foreground hover:bg-tint-strong focus-visible:border-border focus-visible:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/15 disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive/60 sm:text-small",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
