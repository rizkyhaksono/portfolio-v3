"use client"

import Link from "next/link"
import { THEME_HEX } from "@/lib/theme-hex"

const { background, foreground, mutedForeground, border } = THEME_HEX.light

const button = { display: "inline-flex", alignItems: "center", minHeight: 44, padding: "0 12px", borderRadius: 6, font: "inherit", fontSize: 14, fontWeight: 500, cursor: "pointer", textDecoration: "none" } as const

// Replaces the root layout when it crashes, so no globals.css, fonts or theme: Notion's light tokens inline.
export default function GlobalError({ reset }: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", background, color: foreground, fontFamily: "ui-sans-serif, -apple-system, 'Segoe UI', system-ui, sans-serif" }}>
        <title>Something went wrong</title>
        <main style={{ maxWidth: 708, margin: "0 auto", padding: "80px 24px" }}>
          <svg aria-hidden width="56" height="56" viewBox="0 0 24 24" fill="none" stroke={mutedForeground} strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <h1 style={{ margin: "16px 0 0", fontSize: 30, lineHeight: "38px", fontWeight: 600 }}>Something went wrong</h1>
          <p style={{ margin: "8px 0 24px", fontSize: 16, lineHeight: "24px", color: mutedForeground }}>The site could not load. Try again in a moment.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button type="button" onClick={reset} style={{ ...button, border: 0, background: foreground, color: background }}>Try again</button>
            <Link href="/" style={{ ...button, border: `1px solid ${border}`, background, color: foreground }}>Go home</Link>
          </div>
        </main>
      </body>
    </html>
  )
}
