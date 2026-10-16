import { render } from '@testing-library/react'

import { InkedSentence, wordRanges } from '@/components/ui/word-scroll'

describe('wordRanges', () => {
  it.each([1, 2, 3, 12, 40])('starts at 4%% and inks the last of %i words by 50%%', (n) => {
    const ranges = wordRanges(n)
    expect(ranges).toHaveLength(n)
    expect(ranges[0][0]).toBeCloseTo(4)
    expect(ranges[n - 1][1]).toBeCloseTo(50)
  })

  it('caps the window at 46% for short sentences', () => {
    expect(wordRanges(2)).toEqual([[4, 50], [4, 50]])
  })

  it('gives every word the same window, moving forward and overlapping its neighbour', () => {
    const ranges = wordRanges(12)
    const w = (46 * 2.4) / 12
    ranges.forEach(([a, b], i) => {
      expect(b - a).toBeCloseTo(w)
      if (i > 0) {
        expect(a).toBeGreaterThan(ranges[i - 1][0])
        expect(a).toBeLessThan(ranges[i - 1][1])
      }
    })
  })
})

describe('InkedSentence', () => {
  it('keeps the sentence as real text with one inked span per word', () => {
    const text = 'I build production LLM systems.'
    const { container } = render(<InkedSentence text={text} />)
    expect(container.querySelector('[aria-hidden]')?.textContent).toBe(text)
    expect(container.querySelectorAll('.ws__w')).toHaveLength(5)
  })

  it('gives assistive tech the sentence once, as one run', () => {
    const text = 'I build production LLM systems.'
    const { getByText } = render(<InkedSentence text={text} />)
    expect(getByText(text)).toHaveClass('sr-only')
  })
})
