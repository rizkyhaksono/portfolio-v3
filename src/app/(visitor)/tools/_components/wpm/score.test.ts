import { scoreWord, summarize } from "./score"

describe("scoreWord", () => {
  it("counts every letter and the closing space of a clean word", () => {
    expect(scoreWord("the", "the")).toEqual({ correct: 4, errors: 0 })
  })

  it("counts swapped, missing and extra letters as errors", () => {
    expect(scoreWord("teh", "the")).toEqual({ correct: 2, errors: 2 })
    expect(scoreWord("th", "the")).toEqual({ correct: 3, errors: 1 })
    expect(scoreWord("thee", "the")).toEqual({ correct: 4, errors: 1 })
  })
})

describe("summarize", () => {
  it("turns correct characters into words a minute", () => {
    expect(summarize(250, 0, 60)).toEqual({ wpm: 50, accuracy: 100 })
    expect(summarize(125, 0, 15)).toEqual({ wpm: 100, accuracy: 100 })
  })

  it("reports accuracy over the whole test, not the last word", () => {
    expect(summarize(90, 10, 30).accuracy).toBe(90)
  })

  it("stays at zero words and full accuracy before anything is typed", () => {
    expect(summarize(0, 0, 0)).toEqual({ wpm: 0, accuracy: 100 })
  })
})
