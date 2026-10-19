import Link from "next/link"

import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"

interface AuthShellProps {
  /** `split`: a framed mark beside the form (visitor sign-in). `narrow`: one column (callback, admin). */
  variant?: "split" | "narrow"
  title: React.ReactNode
  /** One lead line under the title. */
  standfirst?: React.ReactNode
  /** Under the form, behind a hairline: terms, a way back. */
  footer?: React.ReactNode
  children: React.ReactNode
}

/** Auth pattern (server, no cookies): a frame form slip with baseline fields, outside BaseLayout. */
export function AuthShell({ variant = "split", title, standfirst, footer, children }: Readonly<AuthShellProps>) {
  const split = variant === "split"

  return (
    <main
      id="main"
      className={cn(
        "mx-auto grid min-h-svh w-full content-center gap-12 px-[clamp(20px,4vw,48px)] py-10 sm:py-16",
        // 5 : 7 as fractions, so the gap sits between the two columns only.
        split ? "max-w-[64rem] md:grid-cols-[5fr_7fr]" : "max-w-[30rem]",
      )}
    >
      {split && (
        <div className="hidden border border-ink p-[3px] md:block md:self-start">
          <div className="flex justify-center border border-rule p-8">
            <Logo variant="mark" className="w-56" />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-col">
        <Link href="/" className="inline-flex w-fit items-center gap-3 text-body font-semibold text-ink hover:underline [@media(pointer:coarse)]:min-h-11">
          <Logo variant="mini" className={cn("size-8", split && "md:hidden")} />
          Rizky Haksono
        </Link>

        <header className="mt-10 pb-6">
          <h1 className="font-display text-h2 text-balance text-ink">{title}</h1>
          {standfirst && <p className="mt-3 max-w-[46ch] font-display text-lead text-ink-soft">{standfirst}</p>}
        </header>
        <div aria-hidden className="h-[5px] border-y border-b-rule border-t-ink" />

        <div className="mt-8">{children}</div>

        {footer && <div className="mt-10 border-t border-rule pt-4 text-small text-ink-soft">{footer}</div>}
      </div>
    </main>
  )
}

export default AuthShell
