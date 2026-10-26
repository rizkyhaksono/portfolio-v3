import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { PRINT_HEX } from "@/lib/print-hex"

export const RULE_HEX = PRINT_HEX.rule
export const FONT = "src/assets/fonts/plus-jakarta-sans-latin-600-normal.woff"

/** Card URLs carry `v=` (see ogImageUrl), so a design change gets a new URL and a long cache is safe. */
export const CARD_HEADERS = { "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800" }

let assets: Promise<{ font: Buffer; mark: string }> | undefined

/**
 * Plus Jakarta Sans 600 (OFL, src/assets/fonts/OFL.txt; a static WOFF, which satori reads) and the RH mark
 * for the OG and certificate images, read once per process. Plain cwd paths: webpack rewrites `new URL(..., import.meta.url)` into a
 * /_next/static URL that readFile rejects. next.config.ts traces the font into the standalone build;
 * the Dockerfile copies public/.
 */
export function loadPrintAssets() {
  assets ??= Promise.all([
    readFile(join(process.cwd(), FONT)),
    readFile(join(process.cwd(), "public/brand/og-mark.svg")),
  ])
    .then(([font, svg]) => ({ font, mark: `data:image/svg+xml;base64,${svg.toString("base64")}` }))
    .catch((error: unknown) => {
      // Do not cache the failure: the next request tries again.
      assets = undefined
      throw error
    })
  return assets
}
