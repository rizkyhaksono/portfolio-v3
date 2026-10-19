import { dateline, excerpt } from "./format"

describe("excerpt", () => {
  it("keeps short text whole, without tags", () => {
    expect(excerpt("<p>Fish &amp; chips</p>")).toBe("Fish & chips")
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

describe("dateline", () => {
  it("reads as sentences", () => {
    expect(dateline("2026-03-03T02:00:00Z", 6)).toBe("Published 3 March 2026. 6 minutes to read.")
    expect(dateline(undefined, 1)).toBe("1 minute to read.")
    expect(dateline("not a date")).toBeUndefined()
  })
})
