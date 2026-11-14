/**
 * @jest-environment node
 */
import { readdirSync, readFileSync, statSync } from "fs"
import { join, relative } from "path"

// The UI gate, enforced in CI through jest (docs/ui/README.md). Rules with an `allow` list name files that
// are still being migrated during the v2 redesign: every PR shrinks the lists and the last one empties them.
// Never add a file to a list; fix the file.
const ROOT = process.cwd()

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return name === "node_modules" ? [] : walk(path)
    return /\.(tsx?|css|mdx)$/.test(name) ? [path] : []
  })
}

const files = [...walk(join(ROOT, "src")), ...walk(join(ROOT, "content")), join(ROOT, "tailwind.config.ts")]
  .filter((path) => !path.endsWith("ui-gate.test.ts"))
  .map((path) => ({ path: relative(ROOT, path), text: readFileSync(path, "utf8") }))

const isComment = (line: string) => /^\s*(\/\/|\*|\/\*|\{\/\*)/.test(line)

function offenders(pattern: RegExp, { allow = [], within, skipComments = false }: { allow?: string[]; within?: RegExp; skipComments?: boolean } = {}) {
  return files
    .filter(({ path }) => !allow.includes(path) && (!within || within.test(path)))
    .flatMap(({ path, text }) =>
      text
        .split("\n")
        .flatMap((line, i) => (pattern.test(line) && !(skipComments && isComment(line)) ? [`${path}:${i + 1}: ${line.trim()}`] : [])),
    )
}

// Old changelog entries describe the old design; they are history, not UI.
const NOT_HISTORY = /^(?!content\/changelog\/)/

describe("UI gate", () => {
  // `tint` is not on the list: the name now belongs to Notion's hover fill (bg-tint, bg-tint-strong).
  it("R1: no print-era token classes (ink, paper, rule)", () => {
    const oldTokens = /(?<![\w-])(?:text|bg|border(?:-[trblxyse])?|divide|ring|fill|stroke|outline|decoration|from|to|via|caret|placeholder|shadow|accent)-(?:ink-soft|ink|paper|rule-strong|rule)(?![\w-])/
    expect(offenders(oldTokens)).toEqual([])
  })

  it("R1: no font-display alias", () => {
    expect(offenders(/(?<![\w-])font-display(?![\w-])/)).toEqual([])
  })

  it("R1b: no print-era variables or identifiers", () => {
    const oldNames = /var\(--(?:ink|paper|tint|rule|ink-soft|rule-strong|plate-alpha|ease-print)\)|PRINT_HEX|print-hex|Plus_Jakarta|plus-jakarta|#1E3C9E|#F3ECDC/
    // The card font moves to Onest once the owner approves the font file.
    expect(offenders(oldNames, { allow: ["src/app/api/og/print-assets.ts"], within: NOT_HISTORY })).toEqual([])
  })

  it("R1c: no print-era identity classes", () => {
    const identity = /(?<![\w-])(?:speckle|bg-paper-grain|ink-grain|engraving|tail-piece|reading-hairline|article-rail|masthead|ws__w|plate-(?:paper|night|swap))(?![\w-])/
    expect(offenders(identity, { within: NOT_HISTORY })).toEqual([])
  })

  it("R2: themes only through tokens, never dark: classes", () => {
    expect(offenders(/(?<![\w-])dark:(?=[\w[-])/)).toEqual([])
  })

  it("R3: colour only through tokens", () => {
    const raw = /(?<![\w-])(?:text|bg|border|fill|stroke|ring|from|to|via|outline|decoration|divide)-(?:red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|slate|gray|zinc|neutral|stone)-\d{2,3}|(?<![\w-])(?:text|bg|border|fill|stroke|ring)-(?:white|black)(?![\w-])|#[0-9a-fA-F]{6}\b/
    // theme-hex.ts holds the only hex copies; globals.css and the course MDX are outside src/ components.
    expect(offenders(raw, { allow: ["src/lib/theme-hex.ts"], within: /^src\/(?!.*\.css$)/, skipComments: true })).toEqual([])
  })

  it("R4: sizes, tracking and radius come from the scale", () => {
    const arbitrary = /rounded-\[|text-\[\d+(?:\.\d+)?px\]|tracking-\[|(?<![\w-])uppercase(?![\w-])/
    const allow = [
      // The admin tabs and sidebar are rebuilt in the admin PR.
      "src/app/(admin)/admin/dashboard/_components/collection.tsx",
      "src/app/(admin)/admin/dashboard/analytics/_components/analytics-dashboard.tsx",
      "src/app/(admin)/admin/dashboard/feedback/page.tsx",
      "src/components/layout/admin/admin-spine.tsx",
    ]
    expect(offenders(arbitrary, { allow, within: /^src\//, skipComments: true })).toEqual([])
  })

  it("R6: gradients and blur live only in globals.css and the footer sky", () => {
    const decoration = /gradient-to|bg-gradient|radial-gradient|linear-gradient|backdrop-blur/
    const allow = ["src/app/globals.css", "src/components/ui/sky.tsx"]
    expect(offenders(decoration, { allow, within: /^src\//, skipComments: true })).toEqual([])
  })

  it("R8: nothing casts a shadow", () => {
    // Floating layers are separated by a hairline border; the owner asked for no shadows anywhere.
    const shadow = /(?<![\w-])(?:drop-)?shadow-(?!none(?![\w-]))[\w[]|box-shadow|boxShadow/
    expect(offenders(shadow, { within: /^(?:src\/(?!.*globals\.css$)|tailwind\.config\.ts$)/, skipComments: true })).toEqual([])
  })

  it("R5: no motion libraries or attention loops", () => {
    const motion = /from ['"](?:framer-motion|motion(?:\/react)?|gsap|@gsap\/[^'"]+|lenis|@studio-freight\/lenis)['"]|(?<![\w-])animate-(?:bounce|ping)(?![\w-])/
    expect(offenders(motion)).toEqual([])
  })

  it("R7: no em dash in UI strings", () => {
    // format.ts matches dashes on purpose; course MDX under content/ is authored text, not UI copy.
    const ui = /^src\/(app|components|commons)\//
    expect(offenders(/—/, { allow: ["src/app/_components/blog/format.ts"], within: ui, skipComments: true })).toEqual([])
  })
})
