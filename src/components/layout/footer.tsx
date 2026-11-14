import Link from "next/link"
import { EMAIL, media_socials } from "@/commons/constants/contact"
import { LEGAL_LINKS, navTrack } from "@/commons/constants/navigation-menu"
import { PROSE_WIDTH, WIDE_WIDTH } from "@/lib/design-system"
import { InkLink } from "@/components/ui/ink-link"
import { MalangClock, Sky, SkyToggle } from "@/components/ui/sky"
import { cn } from "@/lib/utils"

const linkClass =
  "inline-flex min-h-11 items-center text-small text-muted-foreground transition-colors duration-ui ease-out hover:text-foreground md:min-h-0"

// Account sits here too: from lg up the menu (which also lists it) is hidden, so this is the way in on desktop.
const SITE_LINKS = [
  { href: "/profile", label: "Account" },
  { href: "/certificates", label: "Certificates" },
  { href: "/changelog", label: "Changelog" },
  ...LEGAL_LINKS,
] as const

/** Opens the feedback dialog (DeferredClientUtilities listens for `data-open-feedback`). */
function FeedbackButton() {
  return (
    <button type="button" data-open-feedback="colophon" aria-haspopup="dialog" className={linkClass}>
      Send feedback
    </button>
  )
}

function FooterLinks({ withSky }: Readonly<{ withSky: boolean }>) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4">
      {media_socials
        .filter(({ title }) => title !== "Instagram")
        .map(({ title, href }) => (
          <li key={title}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="social-click"
              data-umami-event-network={title.toLowerCase()}
              data-umami-event-area="colophon"
              className={linkClass}
            >
              {title}
            </a>
          </li>
        ))}
      <li>
        <a href="/feed.xml" data-track="rss-subscribe" data-track-feed="blog" data-track-area="colophon" className={linkClass}>
          RSS
        </a>
      </li>
      {SITE_LINKS.map(({ href, label }) => (
        <li key={href}>
          <Link href={href} className={linkClass} {...navTrack(href, "colophon")}>
            {label}
          </Link>
        </li>
      ))}
      <li>
        <FeedbackButton />
      </li>
      {withSky && (
        // Not shown on screen (the scene simply moves), but reachable by keyboard and screen readers (WCAG 2.2.2).
        <li>
          <SkyToggle className={cn(linkClass, "sr-only focus-visible:not-sr-only")} />
        </li>
      )}
    </ul>
  )
}

/**
 * The sign-off, set in Langit Malang: the handle, the address, one line of links and the hour in Malang, over a
 * painted landscape with the name set large between the hills. `compact` (on /chat) keeps only the links.
 */
export default function Footer({ variant = "full", wide = false }: Readonly<{ variant?: "full" | "compact"; wide?: boolean }>) {
  const column = wide ? WIDE_WIDTH : PROSE_WIDTH

  if (variant === "compact") {
    return (
      <footer data-print-hide className={cn(column, "pb-4")}>
        <div className="border-t border-border pt-3">
          <FooterLinks withSky={false} />
        </div>
      </footer>
    )
  }

  return (
    <footer
      data-print-hide
      style={{ viewTransitionName: "site-footer" }}
      className="relative isolate mt-8 min-h-[34rem] overflow-hidden sm:min-h-[42rem]"
    >
      <Sky />
      <div className={cn(column, "pt-16")}>
        <p className="text-h1 text-foreground">@rizkyhaksono</p>
        <p className="mt-2 text-body text-muted-foreground">
          Write to me at{" "}
          <InkLink href={`mailto:${EMAIL}`} event="email-click" eventData={{ area: "colophon" }} className="relative after:absolute after:-inset-3">
            {EMAIL}
          </InkLink>
          .
        </p>
        <div className="mt-6">
          <FooterLinks withSky />
        </div>
        <p className="mt-4 text-caption text-muted-foreground">
          © {new Date().getFullYear()} Rizky Haksono. <MalangClock />
        </p>
      </div>
    </footer>
  )
}
