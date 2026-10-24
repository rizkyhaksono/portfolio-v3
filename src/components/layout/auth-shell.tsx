import Link from "next/link"

import { Logo } from "@/components/ui/logo"

interface AuthShellProps {
  title: React.ReactNode
  /** One italic lead line under the title. */
  standfirst?: React.ReactNode
  /** Under the form, behind a hairline: terms, a way back. */
  footer?: React.ReactNode
  children: React.ReactNode
}

/** Auth pattern (server, no cookies): one column with the mark, a title and baseline fields, outside BaseLayout. */
export function AuthShell({ title, standfirst, footer, children }: Readonly<AuthShellProps>) {
  return (
    <main id="main" className="mx-auto grid min-h-svh w-full max-w-[32rem] content-center px-[clamp(20px,4vw,48px)] py-10 sm:py-16">
      <div className="flex min-w-0 flex-col">
        <Link href="/" className="inline-flex w-fit items-center gap-4 text-body font-semibold text-ink hover:underline [@media(pointer:coarse)]:min-h-11">
          <Logo variant="mark" className="w-14 sm:w-16" />
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
