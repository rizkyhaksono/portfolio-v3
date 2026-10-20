// The only nav source: running head, Contents, colophon, command palette and terminal overlay read it.

export type NavArea = "head" | "menu" | "colophon"

export interface NavSection {
  href: string
  label: string
  /** One roman line under the italic label in Contents. */
  note: string
  /** Running head: `md` shows from 768px, `lg` from 1024px; absent means Contents, colophon and ⌘K only. */
  head?: "md" | "lg"
  column: "read" | "try" | "site"
}

export const NAV_SECTIONS: readonly NavSection[] = [
  { href: "/project", label: "Projects", note: "Systems I have built and shipped.", head: "md", column: "read" },
  { href: "/blog", label: "Writing", note: "Essays and notes on AI and engineering.", head: "md", column: "read" },
  { href: "/ai", label: "Etan AI", note: "Ask my résumé, read a document, match a job.", head: "md", column: "try" },
  { href: "/chat", label: "Chat", note: "A public room for leaving a message.", head: "lg", column: "try" },
  { href: "/tracker", label: "Tracker", note: "A public board of what I am working on.", head: "lg", column: "try" },
  { href: "/roadmap", label: "Roadmap", note: "Learning paths, from first principles up.", head: "lg", column: "read" },
  { href: "/tools", label: "Tools", note: "Quizzes, a typing test and small utilities.", head: "lg", column: "try" },
  { href: "/stats", label: "Stats", note: "Readers, coding time and live API health.", head: "lg", column: "site" },
  { href: "/certificates", label: "Certificates", note: "Certificates and courses on record.", column: "read" },
  { href: "/changelog", label: "Changelog", note: "What changed on this site, and when.", column: "site" },
]

export const LEGAL_LINKS = [
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/terms", label: "Terms" },
] as const

export const isCurrentPath = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`)

/** `data-track` attributes for an internal nav link; the delegated listener sends `nav-click { item, area }`. */
export const navTrack = (href: string, area: NavArea) => ({
  "data-track": "nav-click",
  "data-track-item": href.slice(1).replaceAll("/", "-") || "home",
  "data-track-area": area,
})
