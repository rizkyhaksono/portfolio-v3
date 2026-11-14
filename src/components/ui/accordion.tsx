"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => <AccordionPrimitive.Item ref={ref} className={cn("py-0.5", className)} {...props} />)
AccordionItem.displayName = "AccordionItem"

// Notion's toggle: a small triangle before the title turns down when open; the row tints on hover.
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "-mx-1.5 flex min-h-11 flex-1 items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-body font-medium transition-colors hover:bg-tint md:min-h-8 [&[data-state=open]>svg]:rotate-90",
        className
      )}
      {...props}
    >
      <ChevronRight aria-hidden className="size-4 shrink-0 text-muted-foreground transition-transform duration-ui ease-out" strokeWidth={2} />
      {children}
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-body data-[state]:[animation-duration:var(--dur-ui)] data-[state]:[animation-timing-function:var(--ease-out)] data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-2 pl-6 pt-1", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
