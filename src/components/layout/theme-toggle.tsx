"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Contrast } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { track } from "@/lib/analytics"
import { cn } from "@/lib/utils"

/** Flips paper and night print. The pressed state waits for mount, since the server cannot know the theme. */
export function ThemeToggle({ className }: Readonly<{ className?: string }>) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isNight = resolvedTheme === "dark"
  const toggle = () => {
    const to = isNight ? "light" : "dark"
    setTheme(to)
    track("theme-toggle", { to })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Night theme"
      aria-pressed={mounted ? isNight : undefined}
      title={mounted && isNight ? "Switch to paper" : "Switch to night"}
      className={cn(buttonVariants({ variant: "ghost", size: "icon" }), className)}
    >
      <Contrast strokeWidth={1.5} aria-hidden />
    </button>
  )
}
