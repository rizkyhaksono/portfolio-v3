/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/v3/[...path]/route'

jest.mock('@/lib/session', () => ({ getSessionToken: jest.fn(async () => 'session-token') }))

const fetchMock = jest.fn()
const context = (path: string[]) => ({ params: Promise.resolve({ path }) })

beforeAll(() => {
  process.env.API_URL = 'http://api.test'
  global.fetch = fetchMock as unknown as typeof fetch
})

beforeEach(() => {
  fetchMock.mockReset()
  fetchMock.mockResolvedValue(new Response('{"status":200,"data":[]}', { status: 200, headers: { 'content-type': 'application/json' } }))
})

describe('/api/v3 proxy', () => {
  it('forwards to the API with the session from the cookie and keeps the query', async () => {
    const res = await GET(new NextRequest('http://site.test/api/v3/feedback?page=2'), context(['feedback']))

    expect(res.status).toBe(200)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('http://api.test/v3/feedback?page=2')
    expect(init.headers.authorization).toBe('Bearer session-token')
    expect(await res.json()).toEqual({ status: 200, data: [] })
  })

  it('refuses path segments that could climb out of /v3', async () => {
    for (const path of [['..', 'admin'], ['.env'], ['a%2Fb']]) {
      const res = await GET(new NextRequest('http://site.test/api/v3/x'), context(path))
      expect(res.status).toBe(404)
    }
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('refuses a cross-site write', async () => {
    const req = new NextRequest('http://site.test/api/v3/tracker', {
      method: 'POST',
      body: '{}',
      headers: { 'sec-fetch-site': 'cross-site', 'content-type': 'application/json' },
    })
    const res = await POST(req, context(['tracker']))
    expect(res.status).toBe(403)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('passes the API status through', async () => {
    fetchMock.mockResolvedValue(new Response('{"message":"Admin access required"}', { status: 403 }))
    const req = new NextRequest('http://site.test/api/v3/blog', {
      method: 'POST',
      body: '{"title":"x"}',
      headers: { 'sec-fetch-site': 'same-origin', 'content-type': 'application/json' },
    })
    const res = await POST(req, context(['blog']))
    expect(res.status).toBe(403)
    expect(fetchMock.mock.calls[0][1].method).toBe('POST')
  })
})
