import Link from "next/link"

import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"

interface AuthShellProps {
  title: React.ReactNode
  /** One italic lead line under the title. */
  standfirst?: React.ReactNode
  /** Under the form, behind a hairline: terms, a way back. */
  footer?: React.ReactNode
  /** Content for the reversed ink block beside the form (from md). Without it the shell is one narrow column. */
  panel?: React.ReactNode
  children: React.ReactNode
}

/** Auth pattern (server, no cookies): a form slip with baseline fields, optionally beside a reversed ink block. */
export function AuthShell({ title, standfirst, footer, panel, children }: Readonly<AuthShellProps>) {
  return (
    <main
      id="main"
      className={cn(
        "mx-auto grid min-h-svh w-full content-center px-[clamp(20px,4vw,48px)] py-10 sm:py-16",
        // 5 : 7 as fractions, so the gap sits between the two columns only.
        panel ? "max-w-[68rem] gap-12 md:grid-cols-[5fr_7fr] lg:gap-16" : "max-w-[30rem]",
      )}
    >
      {panel && (
        // Reversed out of the ink like a cut in a newspaper: paper type on ink, which flips with the theme.
        <aside className="hidden bg-ink p-8 text-paper md:flex md:flex-col md:justify-between md:gap-16 lg:p-12">
          <Logo variant="mini" className="w-20" />
          {panel}
        </aside>
      )}

      <div className="flex min-w-0 flex-col">
        <Link href="/" className="inline-flex w-fit items-center gap-3 text-body font-semibold text-ink hover:underline [@media(pointer:coarse)]:min-h-11">
          <Logo variant="mini" className={cn("size-8", panel && "md:hidden")} />
          Rizky Haksono
        </Link>

        <header className="mt-10 pb-6">
          <h1 className="font-display text-h2 text-balance text-ink">{title}</h1>
          {standfirst && <p className="mt-3 max-w-[46ch] text-pretty font-display text-lead text-ink-soft">{standfirst}</p>}
        </header>
        <div aria-hidden className="border-t border-ink" />

        <div className="mt-8">{children}</div>

        {footer && <div className="mt-10 border-t border-rule pt-4 text-small text-ink-soft">{footer}</div>}
      </div>
    </main>
  )
}

export default AuthShell
