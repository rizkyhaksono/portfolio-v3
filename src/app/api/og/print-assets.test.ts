import { readFileSync } from "node:fs"
import { join } from "node:path"
import { FONT } from "./print-assets"

it("ships the card font as a static WOFF, the format satori parses", () => {
  const font = readFileSync(join(process.cwd(), FONT))
  expect(font.toString("latin1", 0, 4)).toBe("wOFF")
})
