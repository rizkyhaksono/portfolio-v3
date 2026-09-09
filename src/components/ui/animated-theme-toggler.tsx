"use client"

import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { Switch } from "@/components/ui/switch";

interface AnimatedThemeTogglerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number
}

export const AnimatedThemeToggler = ({
  className,
}: AnimatedThemeTogglerProps) => {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <Switch
      accessKey="theme-mode"
      checked={isDark}
      className={cn(className)}
      onCheckedChange={(checked: boolean) => setTheme(checked ? "dark" : "light")}
    />
  )
}
