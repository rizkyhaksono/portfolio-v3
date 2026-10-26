import { Fragment } from "react"

const pct = (v: number) => `${Math.round(v * 100) / 100}%`

/**
 * Per-word `animation-range` (contain %, on the `.ws` view timeline) so the last word is inked at 50%:
 * w = 46 × 2.4 / n, a_i = 4 + i(46 − w)/(n − 1), b_i = a_i + w. Neighbouring windows overlap.
 */
export function wordRanges(n: number): [number, number][] {
  const w = Math.min(46, (46 * 2.4) / n)
  return Array.from({ length: n }, (_, i) => {
    const a = 4 + (n > 1 ? (i * (46 - w)) / (n - 1) : 0)
    return [a, a + w]
  })
}

/**
 * A sentence that inks itself word by word on the `.ws` view timeline (put `.ws` on a wrapper). Real text nodes (copy and find work);
 * Firefox, older Safari, reduced motion and short viewports get it static and fully inked.
 * Inline-block words reach screen readers as separate objects with no spaces, so assistive tech gets
 * the sentence once as one sr-only run (unselectable, so a copy is not doubled) and skips the words.
 */
export function InkedSentence({ text, className }: Readonly<{ text: string; className?: string }>) {
  const words = text.split(" ")
  const ranges = wordRanges(words.length)

  return (
    <p className={className}>
      <span className="sr-only select-none">{text}</span>
      <span aria-hidden>
        {words.map((word, i) => (
          <Fragment key={i}>
            {i > 0 && " "}
            <span className="ws__w" style={{ animationRange: `contain ${pct(ranges[i][0])} contain ${pct(ranges[i][1])}` }}>
              {word}
            </span>
          </Fragment>
        ))}
      </span>
    </p>
  )
}
