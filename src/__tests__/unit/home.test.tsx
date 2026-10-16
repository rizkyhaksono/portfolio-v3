import { renderToStaticMarkup } from 'react-dom/server'
import { InkedSentence, wordRanges } from '@/components/ui/word-scroll'
import { verifyUrl } from '@/app/_components/certification'
import { formatHours } from '@/app/_components/contribution/wakatime-progress'

describe('wordRanges', () => {
  it('starts at 4% and inks the last word by 50%, in order', () => {
    const ranges = wordRanges(18)
    expect(ranges[0][0]).toBe(4)
    expect(ranges[17][1]).toBeCloseTo(50)
    ranges.slice(1).forEach(([a], i) => expect(a).toBeGreaterThan(ranges[i][0]))
  })

  it('never runs past 50% for very short sentences', () => {
    expect(wordRanges(1)).toEqual([[4, 50]])
  })
})

describe('InkedSentence', () => {
  it('keeps the words as real text with literal animation ranges', () => {
    const html = renderToStaticMarkup(<InkedSentence text="I build production AI systems" />)
    expect(html).toContain('>I</span> <span')
    expect(html).toContain('animation-range:contain 4% contain')
    // Screen readers get the sentence once as one run; the inline-block words are hidden from them.
    expect(html).toContain('<span class="sr-only select-none">I build production AI systems</span><span aria-hidden="true">')
  })
})

describe('verifyUrl', () => {
  it('only returns links a reader can check', () => {
    expect(verifyUrl(null)).toBeNull()
    expect(verifyUrl('https://media.licdn.com/dms/document?e=1765530000')).toBeNull()
    expect(verifyUrl('https://www.linkedin.com/in/rizkyhaksono/details/certifications/')).toBe(
      'https://www.linkedin.com/in/rizkyhaksono/details/certifications/',
    )
    expect(verifyUrl('javascript:alert(1)')).toBeNull()
    expect(verifyUrl('not a url')).toBeNull()
    expect(verifyUrl('https://www.credly.com/badges/abc')).toBe('https://www.credly.com/badges/abc')
  })
})

describe('formatHours', () => {
  it('carries minutes past 60 into hours', () => {
    expect(formatHours(25, 125)).toBe('27 h 5 min')
    expect(formatHours(0, 42)).toBe('42 min')
  })
})
