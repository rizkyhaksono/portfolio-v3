import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { PRINT_HEX } from "@/lib/print-hex"

export const RULE_HEX = PRINT_HEX.rule

/** Card URLs carry `v=` (see ogImageUrl), so a design change gets a new URL and a long cache is safe. */
export const CARD_HEADERS = { "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800" }

/**
 * Satori's font parser throws on a variable font's `fvar` table. Renaming that one table tag in memory
 * makes it skip the variations and draw the default instance (opsz 12, wght 400); the file stays upstream.
 */
export function withoutVariations(font: Buffer) {
  const out = Buffer.from(font)
  for (let record = 12; record < 12 + out.readUInt16BE(4) * 16; record += 16) {
    if (out.toString("latin1", record, record + 4) === "fvar") out.write("_var", record, "latin1")
  }
  return out
}

let assets: Promise<{ font: Buffer; mark: string }> | undefined

/**
 * Literata italic (OFL, src/assets/fonts/OFL.txt) and the RH mark for the OG and certificate images,
 * read once per process. Plain cwd paths: webpack rewrites `new URL(..., import.meta.url)` into a
 * /_next/static URL that readFile rejects. next.config.ts traces the font into the standalone build;
 * the Dockerfile copies public/.
 */
export function loadPrintAssets() {
  assets ??= Promise.all([
    readFile(join(process.cwd(), "src/assets/fonts/literata-italic.ttf")),
    readFile(join(process.cwd(), "public/brand/og-mark.svg")),
  ])
    .then(([font, svg]) => ({ font: withoutVariations(font), mark: `data:image/svg+xml;base64,${svg.toString("base64")}` }))
    .catch((error: unknown) => {
      // Do not cache the failure: the next request tries again.
      assets = undefined
      throw error
    })
  return assets
}
