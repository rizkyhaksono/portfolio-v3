import Link from "next/link"
import { Eyebrow } from "@/components/ui/eyebrow"

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "Projects", href: "/project" },
      { label: "Blog", href: "/blog" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Stats", href: "/stats" },
    ],
  },
  {
    heading: "Playground",
    links: [
      { label: "Etan AI", href: "/ai" },
      { label: "Tools", href: "/tools" },
      { label: "Chat", href: "/chat" },
      { label: "Status", href: "/status" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms", href: "/legal/terms" },
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
]

export default function Footer() {
  const year = 2026

  return (
    <footer className="w-full border-t border-border pt-10 pb-10">
      <div className="flex flex-col gap-10 md:flex-row md:justify-between">
        <div className="max-w-xs">
          <p className="font-display text-lg font-bold tracking-tight">Rizky Haksono</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
            AI engineer building web, mobile, cloud, and AI-driven products.
          </p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            © {year} Rizky Haksono
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <Eyebrow>{col.heading}</Eyebrow>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
