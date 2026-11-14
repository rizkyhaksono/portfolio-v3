import Link from "next/link"
import { Engraving } from "@/components/ui/engraving"
import { Logo } from "@/components/ui/logo"
import { JOB_TITLE } from "@/commons/constants/author"
import { LEGAL_LINKS, NAV_SECTIONS, navTrack } from "@/commons/constants/navigation-menu"
import { SHELL_WIDTH } from "@/lib/design-system"
import { cn } from "@/lib/utils"

const EMAIL = "mrizkyhaksono@gmail.com"
const [MAILBOX, MAIL_DOMAIN] = EMAIL.split("@")

const COLUMNS = [
  { column: "read", heading: "Read" },
  { column: "try", heading: "Try" },
  { column: "site", heading: "Site" },
] as const

const linkClass =
  "inline-flex min-h-11 items-center text-foreground decoration-1 underline-offset-[0.18em] hover:underline md:min-h-0 md:py-0.5"

function InkRule() {
  return <div aria-hidden className="border-t border-foreground" />
}

function BackToTop() {
  return (
    <a href="#main" className={cn(linkClass, "shrink-0 text-small")}>
      Back to top
    </a>
  )
}

/** Opens the feedback dialog (DeferredClientUtilities listens for `data-open-feedback`). */
function FeedbackButton() {
  return (
    <button type="button" data-open-feedback="colophon" aria-haspopup="dialog" className={cn(linkClass, "shrink-0 text-small")}>
      Send feedback
    </button>
  )
}

function LegalLinks() {
  return LEGAL_LINKS.map(({ href, label }) => (
    <li key={href}>
      <Link href={href} className={linkClass} {...navTrack(href, "colophon")}>
        {label}
      </Link>
    </li>
  ))
}

/** Colophon: `full` everywhere, `compact` (one ruled line, no plate) on /chat. */
export default function Footer({
  variant = "full",
  backToTop = true,
}: Readonly<{ variant?: "full" | "compact"; /** Off on pages that never scroll. */ backToTop?: boolean }>) {
  if (variant === "compact") {
    return (
      <footer className={cn(SHELL_WIDTH, "pb-6")}>
        <InkRule />
        <div className="flex flex-wrap items-center gap-x-6 pt-2 text-small">
          <p className="text-foreground">Rizky Haksono</p>
          <ul className="flex gap-x-5">
            <LegalLinks />
          </ul>
          <span className="flex gap-x-5 md:ml-auto">
            <FeedbackButton />
            {backToTop && <BackToTop />}
          </span>
        </div>
      </footer>
    )
  }

  // One field with the page: the theme's own paper, no rules, the Hollar plate fading up into it.
  return (
    <footer className="text-foreground">
      <div className={cn(SHELL_WIDTH, "grid grid-cols-3 gap-x-6 gap-y-10 pt-16 sm:gap-x-12 sm:pt-24 lg:grid-cols-[1fr_auto_auto_auto] lg:gap-x-20")}>
        <div className="col-span-3 flex items-start gap-5 lg:col-span-1">
          <Logo variant="mark" className="w-16 shrink-0 sm:w-20" />
          <div>
            <p className="speckle text-h3 text-foreground">Rizky Haksono</p>
            <p className="mt-1 max-w-[34ch] text-pretty text-small text-muted-foreground">{JOB_TITLE} at Sarana AI, Malang, East Java.</p>
            <a
              href={`mailto:${EMAIL}`}
              data-track="email-click"
              data-track-area="colophon"
              className="mt-3 inline-flex min-h-11 items-center text-foreground underline decoration-1 underline-offset-[0.18em] hover:decoration-2 md:min-h-0"
            >
              {/* Below ~360px the address cannot fit beside the mark; it may break before the @, never mid-word. */}
              {MAILBOX}
              <wbr />@{MAIL_DOMAIN}
            </a>
            <div className="mt-4 flex gap-x-5">
              <FeedbackButton />
              <BackToTop />
            </div>
          </div>
        </div>

        {COLUMNS.map(({ column, heading }) => (
          <nav key={column} aria-labelledby={`colophon-${column}`}>
            <p id={`colophon-${column}`} className="text-small font-semibold text-foreground">
              {heading}
            </p>
            <ul className="mt-3">
              {NAV_SECTIONS.filter((section) => section.column === column).map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={cn(linkClass, "text-muted-foreground hover:text-foreground")} {...navTrack(href, "colophon")}>
                    {label}
                  </Link>
                </li>
              ))}
              {column === "site" && <LegalLinks />}
            </ul>
          </nav>
        ))}
      </div>
      <Engraving crop="band" fade className="mt-10 sm:mt-16" />
    </footer>
  )
}
