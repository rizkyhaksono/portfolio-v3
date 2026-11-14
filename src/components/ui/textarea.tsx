import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-none border-0 border-b border-input bg-transparent px-0 py-2 text-h4 text-foreground placeholder:text-muted-foreground focus-visible:border-b-2 focus-visible:border-foreground focus-visible:outline-none aria-[invalid=true]:border-foreground disabled:cursor-not-allowed disabled:border-dashed disabled:text-muted-foreground",
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
