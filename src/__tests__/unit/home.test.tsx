import { verifyUrl } from '@/app/_components/certification/certification-card'
import { formatHours } from '@/app/_components/contribution/wakatime-progress'

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
