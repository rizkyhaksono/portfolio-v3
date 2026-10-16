/** @jest-environment node */
// Pass-through cache that keeps each wrapped fetcher by key, so tests can check what the cache would see.
const mockCachedFns: Record<string, (...args: number[]) => Promise<unknown>> = {}
jest.mock('next/cache', () => ({
  unstable_cache: (fn: (...args: number[]) => Promise<unknown>, [key]: string[]) => {
    mockCachedFns[key] = fn
    return fn
  },
}))

type UmamiModule = typeof import('@/services/visitor/umami')

const ENV_KEYS = ['UMAMI_API_URL', 'UMAMI_WEBSITE_ID', 'UMAMI_API_KEY', 'UMAMI_USERNAME', 'UMAMI_PASSWORD'] as const
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status })
const fetchMock = jest.fn()

// Fresh module per test so the cached login token never leaks between cases.
const load = (): UmamiModule => {
  jest.resetModules()
  return require('@/services/visitor/umami')
}

beforeEach(() => {
  fetchMock.mockReset()
  global.fetch = fetchMock
  jest.spyOn(console, 'error').mockImplementation(() => {})
  process.env.UMAMI_API_URL = 'https://umami.test/api'
  process.env.UMAMI_WEBSITE_ID = 'site'
  process.env.UMAMI_API_KEY = ''
  process.env.UMAMI_USERNAME = 'viewer'
  process.env.UMAMI_PASSWORD = 'pw'
})

afterEach(() => {
  ENV_KEYS.forEach((key) => delete process.env[key])
  jest.restoreAllMocks()
})

describe('floorTo', () => {
  it('rounds down to the step', () => {
    const { floorTo } = load()
    expect(floorTo(3_599_999, 3_600_000)).toBe(0)
    expect(floorTo(7_200_001, 3_600_000)).toBe(7_200_000)
  })
})

describe('normalizeStats', () => {
  it('turns the v3 comparison (previous period) into deltas', () => {
    const { normalizeStats } = load()
    const stats = normalizeStats({
      pageviews: 120,
      visitors: 40,
      visits: 50,
      bounces: 20,
      totaltime: 900,
      comparison: { pageviews: 100, visitors: 50, visits: 50, bounces: 10, totaltime: 1000 },
    })
    expect(stats).toEqual({
      pageviews: 120,
      visitors: 40,
      visits: 50,
      bounces: 20,
      totaltime: 900,
      comparison: { pageviews: 20, visitors: -10, visits: 0, bounces: 10, totaltime: -100 },
    })
  })

  it('still reads the v2 { value, prev } shape', () => {
    const { normalizeStats } = load()
    const stats = normalizeStats({ pageviews: { value: 30, prev: 10 }, visitors: { value: 5, prev: 7 } })
    expect(stats.pageviews).toBe(30)
    expect(stats.comparison?.pageviews).toBe(20)
    expect(stats.comparison?.visitors).toBe(-2)
    expect(stats.visits).toBe(0)
  })

  it('leaves comparison undefined when Umami sends none', () => {
    const { normalizeStats } = load()
    expect(normalizeStats({ pageviews: 3 }).comparison).toBeUndefined()
  })
})

describe('fillDays', () => {
  it('zero-fills by Asia/Jakarta calendar day, oldest first', () => {
    const { fillDays } = load()
    const now = Date.UTC(2026, 9, 16, 18) // 01:00 on 17 Oct in Jakarta
    expect(fillDays([{ x: '2026-10-16 00:00:00', y: 5 }], 3, now)).toEqual([
      { x: '2026-10-15', y: 0 },
      { x: '2026-10-16', y: 5 },
      { x: '2026-10-17', y: 0 },
    ])
  })
})

describe('fail closed', () => {
  it.each(['UMAMI_API_URL', 'UMAMI_WEBSITE_ID'] as const)('returns empty data without calling Umami when %s is blank', async (key) => {
    process.env[key] = ''
    const umami = load()
    await expect(umami.getUmamiStats()).resolves.toBeNull()
    await expect(umami.getActiveVisitors()).resolves.toBe(0)
    await expect(umami.getUmamiMetrics('path')).resolves.toEqual([])
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('maps connection errors (cause.code) to null', async () => {
    fetchMock.mockRejectedValue(Object.assign(new TypeError('fetch failed'), { cause: { code: 'ECONNREFUSED' } }))
    await expect(load().getUmamiStats()).resolves.toBeNull()
  })

  it('rejects inside unstable_cache on failure, so an outage is never cached', async () => {
    fetchMock.mockResolvedValue(json({}, 503))
    const umami = load()
    await expect(umami.getUmamiStats()).resolves.toBeNull()
    await expect(umami.getUmamiMetrics('path')).resolves.toEqual([])
    await expect(mockCachedFns['umami-stats'](0, 1)).rejects.toThrow('unavailable')
    await expect(mockCachedFns['umami-metrics']('path' as never, 10, 0, 1)).rejects.toThrow('unavailable')
  })

  it('maps a failed login to null', async () => {
    fetchMock.mockResolvedValue(json({ message: 'nope' }, 401))
    await expect(load().getUmamiStats()).resolves.toBeNull()
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})

describe('token refresh', () => {
  it('clears the token and retries once on 401', async () => {
    fetchMock
      .mockResolvedValueOnce(json({ token: 'old' }))
      .mockResolvedValueOnce(json({}, 401))
      .mockResolvedValueOnce(json({ token: 'new' }))
      .mockResolvedValueOnce(json({ visitors: 4 }))

    await expect(load().getActiveVisitors()).resolves.toBe(4)
    expect(fetchMock).toHaveBeenCalledTimes(4)
    expect(fetchMock.mock.calls[3][1].headers.Authorization).toBe('Bearer new')
  })

  it('gives up after the single retry', async () => {
    fetchMock.mockImplementation(async (url: string) => (url.endsWith('/auth/login') ? json({ token: 't' }) : json({}, 401)))
    await expect(load().getActiveVisitors()).resolves.toBe(0)
    expect(fetchMock).toHaveBeenCalledTimes(4)
  })
})

describe('getPathReads', () => {
  it('returns readers per path with trailing slashes merged', async () => {
    fetchMock.mockImplementation(async (url: string) =>
      url.endsWith('/auth/login')
        ? json({ token: 't' })
        : json([
            { x: '/blog/hello', y: 12 },
            { x: '/blog/hello/', y: 3 },
            { x: '/', y: 40 },
          ]),
    )
    const reads = await load().getPathReads()
    expect(reads).toBeInstanceOf(Map)
    expect(reads.get('/blog/hello')).toBe(15)
    expect(reads.get('/')).toBe(40)
    expect(fetchMock.mock.calls[1][0]).toContain('type=path&limit=500')
  })
})
