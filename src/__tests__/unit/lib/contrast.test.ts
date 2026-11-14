import { readFileSync } from "fs"
import { join } from "path"
import { THEME_HEX } from "@/lib/theme-hex"

type Triple = readonly [h: number, s: number, l: number]

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8")

/** `--name:H S% L%` declarations of every `selector{…}` block that defines `--background`, in file order. */
function tokenBlocks(selector: string): Record<string, Triple>[] {
  const blocks = [...css.matchAll(new RegExp(`${selector}\\s*\\{([^}]*)\\}`, "g"))].map((m) => m[1])
  return blocks
    .filter((body) => body.includes("--background:"))
    .map((body) =>
      Object.fromEntries(
        [...body.matchAll(/--([a-z-]+):\s*(-?[\d.]+)\s+([\d.]+)%\s+([\d.]+)%/g)].map(
          (m) => [m[1], [Number(m[2]), Number(m[3]), Number(m[4])] as const],
        ),
      ),
    )
}

const [root] = tokenBlocks(":root")
const [darkBlock, printBlock] = tokenBlocks("\\.dark")
const light = root
const dark = { ...root, ...darkBlock }

const rgb = ([h, s, l]: Triple) => {
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100)
  const channel = (n: number) => {
    const k = (n + h / 30) % 12
    return (l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255
  }
  return [channel(0), channel(8), channel(4)]
}
const luminance = (c: number[]) => {
  const [r, g, b] = c.map((v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a: number[], b: number[]) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
const hex = (t: Triple) => "#" + rgb(t).map((c) => Math.round(c).toString(16).padStart(2, "0")).join("").toUpperCase()
const withinOne = (a: string, b: string) =>
  [1, 3, 5].every((i) => Math.abs(parseInt(a.slice(i, i + 2), 16) - parseInt(b.slice(i, i + 2), 16)) <= 1)

const FLOORS: [string, string, number][] = [
  ["foreground", "background", 7],
  ["muted-foreground", "background", 4.5],
  ["muted-foreground", "muted", 4.5],
  ["foreground", "muted", 7],
  ["input", "background", 3],
  ["destructive", "background", 4.5],
  ["foreground", "sky-wash", 7],
  ["sky", "background", 4.5],
  ["foreground", "popover", 7],
  ["muted-foreground", "popover", 4.5],
]

describe.each([["light", light], ["dark", dark]])("%s theme contrast", (_theme, tokens) => {
  it.each(FLOORS)("%s on %s is at least %d:1", (fg, bg, floor) => {
    expect(tokens[fg]).toBeDefined()
    expect(tokens[bg]).toBeDefined()
    expect(contrast(rgb(tokens[fg]), rgb(tokens[bg]))).toBeGreaterThanOrEqual(floor)
  })
})

describe.each([["light", light], ["dark", dark]] as const)("THEME_HEX.%s", (theme, tokens) => {
  it.each(Object.entries(THEME_HEX[theme]))("%s matches its token (±1 per channel)", (key, value) => {
    const triple = tokens[key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)]
    expect(triple).toBeDefined()
    expect(withinOne(value, hex(triple))).toBe(true)
  })
})

describe("print block", () => {
  it("pins the light triples", () => {
    expect(printBlock).toBeDefined()
    for (const name of ["background", "foreground", "muted", "muted-foreground", "border", "input"]) {
      expect(printBlock[name]).toBeDefined()
      expect(printBlock[name]).toEqual(light[name])
    }
  })
})

