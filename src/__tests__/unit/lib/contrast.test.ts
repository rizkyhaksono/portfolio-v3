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
/** Token and alpha of `--ws-ghost: hsl(var(--TOKEN) / A)` in the first `selector{…}` block that sets it. */
const ghostOf = (selector: string) => {
  const m = css.match(new RegExp(`${selector}\\s*\\{[^}]*--ws-ghost:\\s*hsl\\(var\\(--([a-z-]+)\\)\\s*/\\s*([\\d.]+)\\)`))
  return { token: m?.[1] ?? "", alpha: Number(m?.[2]) }
}
const hex = (t: Triple) => "#" + rgb(t).map((c) => Math.round(c).toString(16).padStart(2, "0")).join("").toUpperCase()
const withinOne = (a: string, b: string) =>
  [1, 3, 5].every((i) => Math.abs(parseInt(a.slice(i, i + 2), 16) - parseInt(b.slice(i, i + 2), 16)) <= 1)

const FLOORS: [string, string, number][] = [
  ["ink", "paper", 7],
  ["ink-soft", "paper", 4.5],
  ["ink-soft", "tint", 4.5],
  ["rule-strong", "paper", 3],
]

describe.each([["light", light], ["dark", dark]])("%s theme contrast", (_theme, tokens) => {
  it.each(FLOORS)("%s on %s is at least %d:1", (fg, bg, floor) => {
    expect(tokens[fg]).toBeDefined()
    expect(tokens[bg]).toBeDefined()
    expect(contrast(rgb(tokens[fg]), rgb(tokens[bg]))).toBeGreaterThanOrEqual(floor)
  })
})

// The unscrolled hero sentence is large text (24px floor, asserted at 375x812 in __tests__/e2e/navigation.spec.ts), so its ghost needs 3:1.
describe.each([["light", light, ":root"], ["dark", dark, "\\.dark"]] as const)("%s wordscroll ghost", (_theme, tokens, selector) => {
  it("the ghost colour over paper is at least 3:1", () => {
    const { token, alpha } = ghostOf(selector)
    expect(tokens[token]).toBeDefined()
    expect(alpha).toBeGreaterThan(0)
    const paper = rgb(tokens.paper)
    const ghost = rgb(tokens[token]).map((c, i) => c * alpha + paper[i] * (1 - alpha))
    expect(contrast(ghost, paper)).toBeGreaterThanOrEqual(3)
  })
})

describe("PRINT_HEX", () => {
  it.each([
    ["paper", light.paper],
    ["ink", light.ink],
    ["inkSoft", light["ink-soft"]],
    ["rule", light.rule],
    ["night", dark.paper],
    ["nightTint", dark.tint],
    ["nightInkSoft", dark["ink-soft"]],
    ["nightInk", dark.ink],
  ] as const)("%s matches its token (±1 per channel)", (key, triple) => {
    expect(withinOne(PRINT_HEX[key], hex(triple))).toBe(true)
  })
})

describe("print block", () => {
  it("pins the light triples", () => {
    expect(printBlock).toBeDefined()
    for (const name of ["paper", "ink", "ink-soft", "rule", "rule-strong", "tint"]) {
      expect(printBlock[name]).toBeDefined()
      expect(printBlock[name]).toEqual(light[name])
    }
  })
})
