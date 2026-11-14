import { excerpt, minutesLabel } from "./format"

describe("excerpt", () => {
  it("keeps short text whole, without tags", () => {
    expect(excerpt("<p>Fish &amp; chips</p>")).toBe("Fish & chips")
  })

  it("turns a description DEV already cut into one clean ellipsis", () => {
    expect(excerpt("Plan, requirements, design,...")).toBe("Plan, requirements, design…")
    expect(excerpt("A boring promise:...")).toBe("A boring promise…")
    expect(excerpt("Still thinking …")).toBe("Still thinking…")
  })

  it("cuts at a word boundary within the limit", () => {
    const text = excerpt(`<p>${"word ".repeat(60)}</p>`, 160)
    expect(text.length).toBeLessThanOrEqual(160)
    expect(text).toMatch(/word…$/)
  })

  it("cuts a single long word hard", () => {
    expect(excerpt("x".repeat(200), 10)).toBe(`${"x".repeat(9)}…`)
  })
})

describe("minutesLabel", () => {
  it("counts in words", () => {
    expect(minutesLabel(6)).toBe("6 minutes")
    expect(minutesLabel(1)).toBe("1 minute")
  })
})
