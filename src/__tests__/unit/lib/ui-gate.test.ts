/**
 * @jest-environment node
 */
import { readdirSync, readFileSync, statSync } from "fs"
import { join, relative } from "path"

// The UI gate, enforced in CI through jest. Each rule lists the files still allowed to break it while the
// redesign lands; every PR shrinks the lists and the last one empties them.
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

function offenders(pattern: RegExp, allow: string[] = []) {
  return files
    .filter(({ path }) => !allow.includes(path))
    .flatMap(({ path, text }) =>
      text.split("\n").flatMap((line, i) => (pattern.test(line) ? [`${path}:${i + 1}: ${line.trim()}`] : [])),
    )
}

describe("UI gate", () => {
  it("R1: no print-era token classes (ink, paper, tint, rule)", () => {
    const oldTokens = /(?<![\w-])(?:text|bg|border(?:-[trblxyse])?|divide|ring|fill|stroke|outline|decoration|from|to|via|caret|placeholder|shadow|accent)-(?:ink-soft|ink|paper|tint|rule-strong|rule)(?![\w-])/
    expect(offenders(oldTokens)).toEqual([])
  })

  it("R1: no font-display alias", () => {
    expect(offenders(/(?<![\w-])font-display(?![\w-])/)).toEqual([])
  })
})
