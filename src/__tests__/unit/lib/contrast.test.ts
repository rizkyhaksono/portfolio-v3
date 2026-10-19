import { readFileSync } from "fs"
import { join } from "path"
import { PRINT_HEX } from "@/lib/print-hex"

type Triple = readonly [h: number, s: number, l: number]

const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8")

/** `--name:H S% L%` declarations of every `selector{…}` block that defines `--paper`, in file order. */
function tokenBlocks(selector: string): Record<string, Triple>[] {
  const blocks = [...css.matchAll(new RegExp(`${selector}\\s*\\{([^}]*)\\}`, "g"))].map((m) => m[1])
  return blocks
    .filter((body) => body.includes("--paper:"))
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
const THEMES = { light: root, dark: { ...root, ...darkBlock } }

const rgb = ([h, s, l]: Triple) => {
  const a = (s / 100) * Math.min(l / 100, 1 - l / 100)
  const channel = (n: number) => {
    const k = (n + h / 30) % 12
    return (l / 100 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))) * 255
  }
  return [channel(0), channel(8), channel(4)]
}
const luminance = (t: Triple) => {
  const [r, g, b] = rgb(t).map((c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const contrast = (a: Triple, b: Triple) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}
const hex = (t: Triple) => "#" + rgb(t).map((c) => Math.round(c).toString(16).padStart(2, "0")).join("").toUpperCase()
const withinOne = (a: string, b: string) =>
  [1, 3, 5].every((i) => Math.abs(parseInt(a.slice(i, i + 2), 16) - parseInt(b.slice(i, i + 2), 16)) <= 1)

const FLOORS: [string, string, number][] = [
  ["ink", "paper", 15],
  ["ink-soft", "paper", 4.5],
  ["ink-soft", "tint", 4.5],
  ["rule-strong", "paper", 3],
  ["mark", "paper", 3],
  ["mark-text", "paper", 4.5],
  ["on-mark", "mark", 4.5],
]

describe.each(Object.entries(THEMES))("%s theme contrast", (_theme, tokens) => {
  it.each(FLOORS)("%s on %s is at least %d:1", (fg, bg, floor) => {
    expect(tokens[fg]).toBeDefined()
    expect(tokens[bg]).toBeDefined()
    expect(contrast(tokens[fg], tokens[bg])).toBeGreaterThanOrEqual(floor)
  })
})

describe("PRINT_HEX", () => {
  it.each([
    ["paper", THEMES.light.paper],
    ["ink", THEMES.light.ink],
    ["inkSoft", THEMES.light["ink-soft"]],
    ["rule", THEMES.light.rule],
    ["mark", THEMES.light.mark],
    ["night", THEMES.dark.paper],
    ["nightInk", THEMES.dark.ink],
    ["nightMark", THEMES.dark.mark],
  ] as const)("%s matches its token (±1 per channel)", (key, triple) => {
    expect(withinOne(PRINT_HEX[key], hex(triple))).toBe(true)
  })
})

describe("print block", () => {
  it("pins the light triples, including the light mark pair", () => {
    expect(printBlock).toBeDefined()
    for (const name of ["paper", "ink", "ink-soft", "rule", "rule-strong", "tint", "mark", "mark-text"]) {
      expect(printBlock[name]).toBeDefined()
      expect(printBlock[name]).toEqual(THEMES.light[name])
    }
  })
})
