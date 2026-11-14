"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import { Contrast } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { track } from "@/lib/analytics"
import { cn } from "@/lib/utils"

/**
 * One path for every theme change: a short crossfade where the browser has view transitions and the visitor
 * allows motion, an instant swap otherwise. The class is set by hand because next-themes applies it in an
 * effect, after the transition has already captured the new frame.
 */
export function switchTheme(setTheme: (theme: string) => void, to: string) {
  const apply = () => {
    const dark = to === "dark" || (to === "system" && matchMedia("(prefers-color-scheme: dark)").matches)
    document.documentElement.classList.toggle("dark", dark)
    document.documentElement.style.colorScheme = dark ? "dark" : "light"
    setTheme(to)
  }
  if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) apply()
  else document.startViewTransition(apply)
}

/** Flips light and dark. The pressed state waits for mount, since the server cannot know the theme. */
export function ThemeToggle({ className }: Readonly<{ className?: string }>) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"
  const toggle = () => {
    const to = isDark ? "light" : "dark"
    switchTheme(setTheme, to)
    track("theme-toggle", { to })
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Dark theme"
      aria-pressed={mounted ? isDark : undefined}
      data-tip={mounted && isDark ? "Switch to light" : "Switch to dark"}
      className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-11 text-muted-foreground hover:text-foreground lg:size-8", className)}
    >
      <Contrast strokeWidth={1.5} aria-hidden />
    </button>
  )
}
