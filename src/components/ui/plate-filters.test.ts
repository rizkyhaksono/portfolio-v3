import { PLATE_RAMPS, rampTable } from "./plate-filters"

const ends = (table: string) => {
  const values = table.split(" ").map(Number)
  return [values[0], values[values.length - 1], values.length]
}

describe("plate ramps", () => {
  it("runs from ink to paper in paper print, night to cream in night print", () => {
    // Blue channel: ink 0x9E, paper 0xDC; night 0x33, cream 0xD2.
    expect(ends(rampTable(PLATE_RAMPS["plate-paper"], 2))).toEqual([0.62, 0.863, 21])
    expect(ends(rampTable(PLATE_RAMPS["plate-night"], 2))).toEqual([0.2, 0.824, 21])
  })

  it("keeps the midtone blue, not grey", () => {
    const mid = [0, 1, 2].map((channel) => Number(rampTable(PLATE_RAMPS["plate-paper"], channel).split(" ")[10]))
    expect(mid[2] - mid[0]).toBeGreaterThan(0.2)
  })
})
