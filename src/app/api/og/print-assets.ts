import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { PRINT_HEX } from "@/lib/print-hex"

export const RULE_HEX = PRINT_HEX.rule

type PrintAssets = {
  fonts: { name: "IBM Plex Sans"; data: Buffer; weight: 400 | 600; style: "normal" }[]
  mark: string
}

let assets: Promise<PrintAssets> | undefined

/**
 * IBM Plex Sans 400 and 600 (OFL, src/assets/fonts/OFL.txt) and the RH mark for the OG and certificate images,
 * read once per process. Satori reads WOFF, not WOFF2, and draws only a variable font's default instance, hence
 * static files. Plain cwd paths: webpack rewrites `new URL(..., import.meta.url)` into a /_next/static URL that
 * readFile rejects. next.config.ts traces the fonts into the standalone build; the Dockerfile copies public/.
 */
export function loadPrintAssets() {
  const read = (path: string) => readFile(join(process.cwd(), path))
  assets ??= Promise.all([
    read("src/assets/fonts/ibm-plex-sans-latin-400-normal.woff"),
    read("src/assets/fonts/ibm-plex-sans-latin-600-normal.woff"),
    read("public/brand/og-mark.svg"),
  ])
    .then(([regular, semibold, svg]): PrintAssets => ({
      fonts: [
        { name: "IBM Plex Sans", data: regular, weight: 400, style: "normal" },
        { name: "IBM Plex Sans", data: semibold, weight: 600, style: "normal" },
      ],
      mark: `data:image/svg+xml;base64,${svg.toString("base64")}`,
    }))
    .catch((error: unknown) => {
      // Do not cache the failure: the next request tries again.
      assets = undefined
      throw error
    })
  return assets
}
