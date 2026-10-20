import { getAllChangelogs } from '@/lib/mdx'

describe('getAllChangelogs', () => {
  it('puts the newest release first, breaking date ties by version', () => {
    const [newest, ...rest] = getAllChangelogs()

    expect(newest.meta.version).toBe('1.7.0')
    expect(rest.map(({ meta }) => meta.version)).toContain('1.6.0')
  })

  it('orders 1.7.0 before 1.6.0 although both are dated 2026-10-20', () => {
    const versions = getAllChangelogs()
      .filter(({ meta }) => meta.date === '2026-10-20')
      .map(({ meta }) => meta.version)

    expect(versions).toEqual(['1.7.0', '1.6.0'])
  })
})
