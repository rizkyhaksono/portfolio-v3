import { heatLevels } from '@/components/ui/ink-heatmap'

describe('heatLevels', () => {
  it('buckets non-zero days by quartile, so one outlier does not flatten the year', () => {
    const level = heatLevels([0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 126])
    expect(level(0)).toBe(0)
    expect([1, 4, 6, 8, 126].map(level)).toEqual([1, 2, 3, 4, 4])
    expect(new Set([1, 2, 3, 4, 5, 6, 7, 8, 126].map(level))).toEqual(new Set([1, 2, 3, 4]))
  })

  it('keeps equal counts on one level and empty years at zero', () => {
    expect([1, 1, 1].map(heatLevels([1, 1, 1]))).toEqual([1, 1, 1])
    expect(heatLevels([0, 0])(0)).toBe(0)
  })
})
