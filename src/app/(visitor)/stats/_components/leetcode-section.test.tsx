import { calendarWeeks } from './leetcode-section'

describe('calendarWeeks', () => {
  // Wednesday 15 October 2025
  const today = new Date('2025-10-15T09:30:00Z')
  const weeks = calendarWeeks([{ date: '2025-10-14', count: 3 }, { date: '2020-01-01', count: 9 }], today)
  const days = weeks.flatMap((w) => w.contributionDays)

  it('starts on a Sunday and ends today, with no future days', () => {
    expect(new Date(`${days[0].date}T00:00:00Z`).getUTCDay()).toBe(0)
    expect(days.at(-1)?.date).toBe('2025-10-15')
    expect(weeks.at(-1)?.contributionDays).toHaveLength(4)
    weeks.slice(0, -1).forEach((w) => expect(w.contributionDays).toHaveLength(7))
  })

  it('maps counts by date and leaves older submissions out', () => {
    expect(days.find((d) => d.date === '2025-10-14')?.contributionCount).toBe(3)
    expect(days.reduce((sum, d) => sum + d.contributionCount, 0)).toBe(3)
  })
})
