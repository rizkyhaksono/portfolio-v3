import { fillHours } from "./fill-hours"

describe("fillHours", () => {
  const now = Date.parse("2026-10-19T07:30:00Z") // 14:30 in Malang

  it("fills missing hours with zeros, oldest first", () => {
    const filled = fillHours([{ x: "2026-10-19 13:00:00", y: 4 }, { x: "2026-10-19 14:00:00", y: 2 }], 3, now)
    expect(filled).toEqual([
      { x: "2026-10-19 12:00:00", y: 0 },
      { x: "2026-10-19 13:00:00", y: 4 },
      { x: "2026-10-19 14:00:00", y: 2 },
    ])
  })

  it("keeps the raw series when its keys do not line up", () => {
    const raw = [{ x: "2026-10-19T07:00:00Z", y: 5 }]
    expect(fillHours(raw, 3, now)).toBe(raw)
  })
})
