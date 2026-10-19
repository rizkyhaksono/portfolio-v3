"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Contrast } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { track } from "@/lib/analytics"
import { cn } from "@/lib/utils"

/** Flips light and dark. The pressed state waits for mount, since the server cannot know the theme. */
export function ThemeToggle({ className }: Readonly<{ className?: string }>) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"
  const toggle = () => {
    const to = isDark ? "light" : "dark"
    setTheme(to)
    track("theme-toggle", { to })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Dark theme"
      aria-pressed={mounted ? isDark : undefined}
      data-tip={mounted && isDark ? "Switch to light" : "Switch to dark"}
      className={cn(buttonVariants({ variant: "ghost", size: "icon" }), className)}
    >
      <Contrast strokeWidth={1.5} aria-hidden />
    </button>
  )
}
