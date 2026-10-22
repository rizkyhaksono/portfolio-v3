"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

// The list scrolls sideways on phones, so the focus ring sits inside each trigger instead of being clipped.
// The hairline is an inset line, not a border, so the active 2px underline prints over it instead of under it.
const TabsList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>>(({ className, ...props }, ref) => (
  <TabsPrimitive.List ref={ref} className={cn("items-end gap-6 text-ink-soft shadow-[inset_0_-1px_0_hsl(var(--rule))]", !className?.includes("grid") && "flex max-w-full overflow-x-auto", className)} {...props} />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-none border-b-2 border-transparent px-1 pb-1.5 pt-2 text-[15px] font-semibold transition-colors [transition-duration:var(--dur-ui)] [transition-timing-function:var(--ease-print)] hover:text-ink disabled:pointer-events-none disabled:opacity-50 data-[state=active]:border-ink data-[state=active]:text-ink focus-visible:[outline-offset:-2px] [@media(pointer:coarse)]:min-h-11",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content ref={ref} className={cn("mt-6", className)} {...props} />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
