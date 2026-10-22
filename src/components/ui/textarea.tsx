import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-none border-0 border-b border-input bg-transparent px-0 py-2 text-h4 text-ink placeholder:text-ink-soft focus-visible:border-b-2 focus-visible:border-ink focus-visible:outline-none aria-[invalid=true]:border-ink disabled:cursor-not-allowed disabled:border-dashed disabled:text-ink-soft",
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
