"use client"

import Link from "next/link"
import type { RefObject } from "react"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { Search } from "lucide-react"
import { Sheet, SheetClose, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { buttonVariants } from "@/components/ui/button"
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

/** The full-height Contents sheet: search, every section, theme and account. Loaded on first open. */
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
        className="flex w-full max-w-none flex-col gap-0 overflow-y-auto p-0 sm:max-w-[28rem]"
      >
        <div className="flex min-h-[var(--head-h)] items-center border-b border-rule px-5 pr-14">
          <SheetTitle>Contents</SheetTitle>
        </div>

        <div className="px-5 pb-10 pt-5">
          <SheetClose asChild>
            <button
              type="button"
              data-open-search="contents"
              aria-keyshortcuts="Meta+K Control+K"
              className="flex min-h-11 w-full items-center gap-3 border-b border-input text-left text-base text-ink-soft hover:border-ink"
            >
              <Search className="size-4 shrink-0" strokeWidth={1.5} aria-hidden />
              Search pages and posts
              <kbd className="ml-auto hidden text-caption md:inline" aria-hidden>
                ⌘K
              </kbd>
            </button>
          </SheetClose>

          <nav aria-label="Contents" className="mt-6">
            <ul>
              {NAV_SECTIONS.map(({ href, label, note }) => (
                <li key={href} className="border-b border-rule">
                  <SheetClose asChild>
                    <Link
                      href={href}
                      aria-current={isCurrentPath(pathname, href) ? "page" : undefined}
                      className="group block py-3"
                      {...navTrack(href, "contents")}
                    >
                      <span className="block font-display text-[1.75rem] leading-tight decoration-1 underline-offset-[0.2em] group-hover:underline group-aria-[current=page]:underline group-aria-[current=page]:decoration-2">
                        {label}
                      </span>
                      <span className="mt-0.5 block text-small text-ink-soft">{note}</span>
                    </Link>
                  </SheetClose>
                </li>
              ))}
            </ul>
          </nav>

          <RadioGroup
            value={theme}
            onValueChange={chooseTheme}
            aria-labelledby="contents-theme"
            className="mt-8 gap-0"
          >
            <p id="contents-theme" className="font-display text-caption text-ink-soft">
              Theme
            </p>
            <div className="flex flex-wrap gap-x-6">
              {THEMES.map(({ value, label }) => (
                <Label key={value} className="flex min-h-11 cursor-pointer items-center gap-2 text-base font-normal">
                  <RadioGroupItem value={value} />
                  {label}
                </Label>
              ))}
            </div>
          </RadioGroup>

          <div className="mt-8 border-t border-rule pt-5">
            <SheetClose asChild>
              <Link href="/profile" className={buttonVariants({ variant: "outline" })} {...navTrack("/profile", "contents")}>
                Account
              </Link>
            </SheetClose>
            <p className="mt-2 text-small text-ink-soft">Sign in, or open your profile.</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
