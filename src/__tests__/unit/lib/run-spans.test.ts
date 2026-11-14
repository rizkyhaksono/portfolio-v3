import { runSpans } from "@/lib/run-spans"

describe("runSpans", () => {
  it("merges adjacent equal rows only", () => {
    expect(runSpans(["A", "A", "B", "C", "C", "C", "A"], (x) => x)).toEqual([2, 0, 1, 3, 0, 0, 1])
  })
  it("handles empty and single rows", () => {
    expect(runSpans([], (x: string) => x)).toEqual([])
    expect(runSpans(["A"], (x) => x)).toEqual([1])
  })
})
