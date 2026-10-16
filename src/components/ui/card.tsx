import { forwardRef, type HTMLAttributes } from "react"

import { cn } from "@/lib/utils"
import { SURFACE } from "@/lib/design-system"

/** Frame surface: 1px rule hairline on the paper itself. No fill, no shadow. */
const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(SURFACE.solid, className)} {...props} />
))
Card.displayName = "Card"

/** Header region for a compact editorial Card. */
const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-4", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

/** Title text inside a CardHeader. */
const CardTitle = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("font-display text-h4 text-ink", className)} {...props} />
))
CardTitle.displayName = "CardTitle"

/** Muted description text inside a CardHeader. */
const CardDescription = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("text-small text-ink-soft", className)} {...props} />
))
CardDescription.displayName = "CardDescription"

/** Main body of a compact editorial Card. */
const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-4 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

/** Footer actions region for a Card. */
const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-4 pt-0", className)} {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
