import Link from "next/link"
import { Engraving } from "@/components/ui/engraving"
import { Logo } from "@/components/ui/logo"
import { JOB_TITLE } from "@/commons/constants/author"
import { LEGAL_LINKS, NAV_SECTIONS, navTrack } from "@/commons/constants/navigation-menu"
import { cn } from "@/lib/utils"
import { SHELL_WIDTH } from "./running-head"

const EMAIL = "mrizkyhaksono@gmail.com"

const COLUMNS = [
  { column: "read", heading: "Read" },
  { column: "try", heading: "Try" },
  { column: "site", heading: "Site" },
] as const

const linkClass =
  "inline-flex min-h-11 items-center text-ink decoration-1 underline-offset-[0.18em] hover:underline md:min-h-0 md:py-0.5"

function DoubleRule() {
  return <div aria-hidden className="h-[5px] border-y border-b-rule border-t-ink" />
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

/** Colophon: `full` everywhere, `compact` (one ruled line, no plate) on /ai and /chat. */
export default function Footer({ variant = "full" }: Readonly<{ variant?: "full" | "compact" }>) {
  if (variant === "compact") {
    return (
      <footer className={cn(SHELL_WIDTH, "pb-6")}>
        <DoubleRule />
        <div className="flex flex-wrap items-center gap-x-6 pt-2 text-small">
          <p className="font-display text-ink">Rizky Haksono</p>
          <ul className="flex gap-x-5">
            <LegalLinks />
          </ul>
          <span className="ml-auto flex gap-x-5">
            <FeedbackButton />
            <BackToTop />
          </span>
        </div>
      </footer>
    )
  }

  return (
    <footer>
      <div className={SHELL_WIDTH}>
        <DoubleRule />
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 pt-10 sm:grid-cols-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="col-span-2 flex items-start gap-5 sm:col-span-3 lg:col-span-1">
            <Logo variant="seal" className="w-24 shrink-0 sm:w-28" />
            <div>
              <p className="font-display text-h3 text-ink">Rizky Haksono</p>
              <p className="mt-1 text-small text-ink-soft">{JOB_TITLE} at Sarana AI, Malang, East Java.</p>
              <a
                href={`mailto:${EMAIL}`}
                data-track="email-click"
                data-track-area="colophon"
                className="mt-2 inline-flex min-h-11 items-center text-ink underline decoration-1 underline-offset-[0.18em] hover:decoration-2 md:min-h-0"
              >
                {EMAIL}
              </a>
            </div>
          </div>

          {COLUMNS.map(({ column, heading }) => (
            <nav key={column} aria-labelledby={`colophon-${column}`} className={cn(column === "site" && "col-span-2 sm:col-span-1")}>
              <p id={`colophon-${column}`} className="font-display text-caption text-ink-soft">
                {heading}
              </p>
              <ul className={cn("mt-2", column === "site" && "columns-2 gap-x-6 sm:columns-1")}>
                {NAV_SECTIONS.filter((section) => section.column === column).map(({ href, label }) => (
                  <li key={href}>
                    <Link href={href} className={linkClass} {...navTrack(href, "colophon")}>
                      {label}
                    </Link>
                  </li>
                ))}
                {column === "site" && <LegalLinks />}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-rule py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8">
          <p className="max-w-[62ch] text-small text-ink-soft">
            Set in Literata. Printed in one ink in Malang, East Java. The mark shows the Tengger caldera. Plate after Wenceslaus Hollar,{" "}
            <cite>Landscape with a Rider</cite>, 1650, after Jan Wildens, Rijksmuseum (public domain).
          </p>
          <div className="flex shrink-0 gap-x-5">
            <FeedbackButton />
            <BackToTop />
          </div>
        </div>
      </div>
      <Engraving crop="band" className="mt-6" />
    </footer>
  )
}
