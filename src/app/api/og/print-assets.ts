import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { THEME_HEX } from "@/lib/theme-hex"

export const RULE_HEX = THEME_HEX.light.border
export const FONT = "src/assets/fonts/plus-jakarta-sans-latin-600-normal.woff"

/** Card URLs carry `v=` (see ogImageUrl), so a design change gets a new URL and a long cache is safe. */
export const CARD_HEADERS = { "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800" }

let assets: Promise<{ font: Buffer }> | undefined

/**
 * Plus Jakarta Sans 600 (OFL, src/assets/fonts/OFL.txt; a static WOFF, which satori reads) for the OG and
 * certificate images, read once per process. Plain cwd path: webpack rewrites `new URL(..., import.meta.url)` into a
 * /_next/static URL that readFile rejects. next.config.ts traces the font into the standalone build.
 */
export function loadPrintAssets() {
  assets ??= readFile(join(process.cwd(), FONT))
    .then((font) => ({ font }))
    .catch((error: unknown) => {
      // Do not cache the failure: the next request tries again.
      assets = undefined
      throw error
    })
  return assets
}
