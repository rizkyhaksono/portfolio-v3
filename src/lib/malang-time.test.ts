import { skyPhase } from "./malang-time"

// Times are UTC; Malang is UTC+7, so 22:00 UTC is 05:00 in Malang.
const at = (utc: string) => new Date(`2026-11-20T${utc}:00Z`)

describe("skyPhase", () => {
  it.each([
    ["21:59", "evening"],
    ["22:00", "dawn"],
    ["00:59", "dawn"],
    ["01:00", "day"],
    ["07:59", "day"],
    ["08:00", "dusk"],
    ["10:59", "dusk"],
    ["11:00", "evening"],
  ] as const)("%s UTC is %s in Malang", (utc, phase) => {
    expect(skyPhase(at(utc))).toBe(phase)
  })
})
