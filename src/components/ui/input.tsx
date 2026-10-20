import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-none [@media(pointer:coarse)]:min-h-11 border-0 border-b border-input bg-transparent px-0 py-2 text-base text-ink placeholder:text-ink-soft file:border-0 file:bg-transparent file:text-small file:font-semibold file:text-ink focus-visible:border-b-2 focus-visible:border-ink focus-visible:outline-none aria-[invalid=true]:border-ink disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
