import { startOf } from "./career-dates"

describe("startOf", () => {
  it.each([
    ["Aug 2024 - Present", 2024 * 12 + 7],
    ["January 2020 - Mar 2021", 2020 * 12],
    ["Dec 2019", 2019 * 12 + 11],
    ["2019 to 2023", 0],
    ["", 0],
  ])("%s sorts at %d", (duration, months) => {
    expect(startOf(duration)).toBe(months)
  })
})
