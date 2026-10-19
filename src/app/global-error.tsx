"use client"

import { PRINT_HEX } from "@/lib/print-hex"

// Replaces the root layout when it crashes, so no globals.css, fonts or theme: light tokens inline.
export default function GlobalError({ reset }: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", padding: "0 16px", background: PRINT_HEX.paper, color: PRINT_HEX.ink, fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
        <title>Something went wrong</title>
        <main>
          {/* eslint-disable-next-line @next/next/no-img-element -- no CSS or tokens here, so the light logo file */}
          <img src="/brand/mark-light.svg" alt="Rizky Haksono" width={108} height={96} style={{ display: "block", marginBottom: 24 }} />
          <h1 style={{ margin: 0, fontSize: 40, fontWeight: 600 }}>Something went wrong</h1>
          <p style={{ color: PRINT_HEX.inkSoft }}>The site could not load. Try again in a moment.</p>
          <button type="button" onClick={reset} style={{ border: 0, borderRadius: 0, padding: "10px 16px", background: PRINT_HEX.ink, color: PRINT_HEX.paper, font: "inherit", fontWeight: 600, cursor: "pointer" }}>Try again</button>
        </main>
      </body>
    </html>
  )
}
