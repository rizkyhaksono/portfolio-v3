"use client"

import { useEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"

import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch";

interface AnimatedThemeTogglerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number
}

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
}: AnimatedThemeTogglerProps) => {
  const [isDark, setIsDark] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }

    updateTheme()

    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  return (
    <Switch
      accessKey="theme-mode"
      checked={isDark}
      ref={buttonRef}
      className={cn(className)}
      onCheckedChange={(checked: boolean) => {
        (async () => {
          if (!buttonRef.current) return

          await document.startViewTransition(() => {
            flushSync(() => {
              setIsDark(checked)
              if (checked) document.documentElement.classList.add("dark")
              else document.documentElement.classList.remove("dark")
              localStorage.setItem("theme", checked ? "dark" : "light")
            })
          }).ready

          const { top, left, width, height } =
            buttonRef.current.getBoundingClientRect()
          const x = left + width / 2
          const y = top + height / 2
          const maxRadius = Math.hypot(
            Math.max(left, window.innerWidth - left),
            Math.max(top, window.innerHeight - top)
          )

          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${maxRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration,
              easing: "ease-in-out",
              pseudoElement: "::view-transition-new(root)",
            }
          )
        })()
      }}
    />
  )
}
