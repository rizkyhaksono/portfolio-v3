import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface AuthShellProps {
  title: React.ReactNode
  /** The grey second line under the title, as on Notion's sign-in page. */
  description?: React.ReactNode
  /** Short muted lines under the form: the terms, a way back. */
  footer?: React.ReactNode
  children: React.ReactNode
  className?: string
}

/**
 * Auth pattern (server, no cookies), after Notion's sign-in page: the owner's name top left, then one 320px column
 * in the middle of the page with a two-line title (ink, then grey), the form, and the small print under it.
 */
export function AuthShell({ title, description, footer, children, className }: Readonly<AuthShellProps>) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="flex h-14 items-center px-3 sm:px-5">
        <Link href="/" className="inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-small font-medium text-foreground transition-colors hover:bg-tint md:min-h-8">
          <Image src="/rizky.jpg" alt="" width={20} height={20} className="size-5 rounded object-cover" />
          Rizky Haksono
        </Link>
      </header>

      <main id="main" className="flex flex-1 justify-center px-6 pb-16 pt-[6vh] sm:pt-[10vh]">
        <div className={cn("w-full max-w-xs", className)}>
          <header className="mb-8 text-center">
            <h1 className="text-balance text-h2 text-foreground">{title}</h1>
            {description && <p className="text-balance text-h2 text-muted-foreground">{description}</p>}
          </header>

          {children}

          {footer && <div className="mt-10 flex flex-col items-center gap-2 text-center text-caption text-muted-foreground">{footer}</div>}
        </div>
      </main>
    </div>
  )
}

export default AuthShell
