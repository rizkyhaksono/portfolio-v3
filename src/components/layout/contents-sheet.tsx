"use client"

import Link from "next/link"
import type { RefObject } from "react"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { NAV_SECTIONS, isCurrentPath, navTrack } from "@/commons/constants/navigation-menu"
import { track } from "@/lib/analytics"

const THEMES = [
  { value: "light", label: "Paper" },
  { value: "dark", label: "Night" },
  { value: "system", label: "System" },
] as const

interface ContentsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** The trigger lives outside Radix (see contents-trigger.tsx), so focus goes back to it by hand. */
  returnFocus: RefObject<HTMLButtonElement | null>
}

/** The menu sheet: every section, the theme and the account link. Loaded on first open. */
export function ContentsSheet({ open, onOpenChange, returnFocus }: Readonly<ContentsSheetProps>) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  const chooseTheme = (to: string) => {
    setTheme(to)
    track("theme-toggle", { to })
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        aria-describedby={undefined}
        onCloseAutoFocus={(event) => {
          event.preventDefault()
          returnFocus.current?.focus({ preventScroll: true })
        }}
        className="flex w-full max-w-none flex-col gap-0 overflow-y-auto p-0 sm:max-w-[24rem]"
      >
        <div className="flex min-h-12 items-center px-5 pr-14 md:min-h-[var(--head-h)]">
          <SheetTitle className="sr-only">Menu</SheetTitle>
        </div>

        <nav aria-label="Menu" className="px-5">
          <ul>
            {NAV_SECTIONS.map(({ href, label }) => (
              <li key={href}>
                <SheetClose asChild>
                  <Link
                    href={href}
                    aria-current={isCurrentPath(pathname, href) ? "page" : undefined}
                    className="flex min-h-12 items-center font-display text-h2 leading-tight text-ink decoration-1 underline-offset-[0.2em] hover:underline aria-[current=page]:underline aria-[current=page]:decoration-2"
                    {...navTrack(href, "menu")}
                  >
                    {label}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-rule px-5 py-4">
          <RadioGroup value={theme} onValueChange={chooseTheme} aria-label="Theme" className="flex gap-x-5 gap-y-0">
            {THEMES.map(({ value, label }) => (
              <Label key={value} className="flex min-h-11 cursor-pointer items-center gap-2 text-small font-normal text-ink">
                <RadioGroupItem value={value} />
                {label}
              </Label>
            ))}
          </RadioGroup>
          <SheetClose asChild>
            <Link href="/profile" className="inline-flex min-h-11 items-center text-small font-semibold text-ink underline decoration-1 underline-offset-[0.18em] hover:decoration-2" {...navTrack("/profile", "menu")}>
              Account
            </Link>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  )
}
