import { readFileSync } from "node:fs"
import { join } from "node:path"
import { withoutVariations } from "./print-assets"

const tags = (font: Buffer) =>
  Array.from({ length: font.readUInt16BE(4) }, (_, i) => font.toString("latin1", 12 + i * 16, 16 + i * 16))

it("hides only the fvar table from satori and leaves the file buffer untouched", () => {
  const font = readFileSync(join(__dirname, "../../../assets/fonts/literata-italic.ttf"))
  const patched = withoutVariations(font)

  expect(tags(font)).toContain("fvar")
  expect(tags(patched)).not.toContain("fvar")
  expect(tags(patched)).toEqual(tags(font).map((tag) => (tag === "fvar" ? "_var" : tag)))
  expect(patched.length).toBe(font.length)
})
