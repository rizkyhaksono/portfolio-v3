/**
 * @jest-environment node
 */
import { apiProxyHeaders, trustedClientIp } from '@/lib/trusted-client-ip'

const headers = (init: Record<string, string>) => new Headers(init)

describe('trustedClientIp', () => {
  it('ignores the Cloudflare header, which no proxy in front of this site sets', () => {
    expect(trustedClientIp(headers({ 'cf-connecting-ip': '1.1.1.1', 'x-real-ip': '203.0.113.9' }))).toBe('203.0.113.9')
    expect(trustedClientIp(headers({ 'cf-connecting-ip': '1.1.1.1' }))).toBe('')
  })

  it('falls back to the hop the proxy appended, never the first one', () => {
    expect(trustedClientIp(headers({ 'x-forwarded-for': '6.6.6.6, 203.0.113.9' }))).toBe('203.0.113.9')
  })

  it('refuses values that are not addresses', () => {
    expect(trustedClientIp(headers({ 'x-real-ip': 'evil', 'x-forwarded-for': 'also-evil' }))).toBe('')
  })
})

describe('apiProxyHeaders', () => {
  const secret = process.env.INTERNAL_PROXY_SECRET
  afterEach(() => {
    process.env.INTERNAL_PROXY_SECRET = secret
  })

  it('sends the internal key only when it is configured', () => {
    delete process.env.INTERNAL_PROXY_SECRET
    expect(apiProxyHeaders(headers({ 'x-real-ip': '203.0.113.9' }))).toEqual({
      'x-client-ip': '203.0.113.9',
      'x-real-ip': '203.0.113.9',
    })

    process.env.INTERNAL_PROXY_SECRET = 'k'
    expect(apiProxyHeaders(headers({ 'x-real-ip': '203.0.113.9' }))).toEqual({
      'x-internal-key': 'k',
      'x-client-ip': '203.0.113.9',
      'x-real-ip': '203.0.113.9',
    })
  })

  it('leaves the address out when there is no trustworthy one', () => {
    process.env.INTERNAL_PROXY_SECRET = 'k'
    expect(apiProxyHeaders(headers({ 'cf-connecting-ip': '1.1.1.1' }))).toEqual({ 'x-internal-key': 'k' })
  })
})
