/** Right and wrong characters in one finished word. Missing or extra letters are wrong; the space that ends the word counts as right. */
export function scoreWord(typed: string, target: string) {
  let correct = 1
  for (let i = 0; i < Math.min(typed.length, target.length); i++) {
    if (typed[i] === target[i]) correct++
  }
  return { correct, errors: Math.max(typed.length, target.length) - (correct - 1) }
}

/** Net words a minute (five characters to a word) and accuracy over the whole test, both rounded. */
export function summarize(correct: number, errors: number, seconds: number) {
  const total = correct + errors
  return {
    wpm: seconds > 0 ? Math.round(correct / 5 / (seconds / 60)) : 0,
    accuracy: total > 0 ? Math.round((correct / total) * 100) : 100,
  }
}
