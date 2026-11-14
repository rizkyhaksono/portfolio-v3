"use client"

import { THEME_HEX } from "@/lib/theme-hex"

const { background, foreground, mutedForeground } = THEME_HEX.light

// Replaces the root layout when it crashes, so no globals.css, fonts or theme: light tokens inline.
export default function GlobalError({ reset }: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", padding: "0 16px", background, color: foreground, fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
        <title>Something went wrong</title>
        <main>
          <p style={{ margin: "0 0 24px", fontWeight: 600 }}>Rizky Haksono</p>
          <h1 style={{ margin: 0, fontSize: 40, fontWeight: 600 }}>Something went wrong</h1>
          <p style={{ color: mutedForeground }}>The site could not load. Try again in a moment.</p>
          <button type="button" onClick={reset} style={{ border: 0, borderRadius: 12, padding: "10px 16px", background: foreground, color: background, font: "inherit", fontWeight: 600, cursor: "pointer" }}>Try again</button>
        </main>
      </body>
    </html>
  )
}
