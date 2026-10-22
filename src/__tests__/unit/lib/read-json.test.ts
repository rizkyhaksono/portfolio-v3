/**
 * @jest-environment node
 */
import { z } from 'zod'
import { readJson } from '@/lib/read-json'

const Body = z.object({ text: z.string().min(1).max(10) })

const post = (body: string, headers: Record<string, string> = {}) =>
  new Request('http://x/api', { method: 'POST', body, headers })

describe('readJson', () => {
  it('returns the parsed body and drops keys the schema does not know', async () => {
    expect(await readJson(post('{"text":"hi","extra":1}'), Body, 100)).toEqual({ ok: true, data: { text: 'hi' } })
  })

  it('refuses a body over the cap even when Content-Length is missing or lies', async () => {
    const big = JSON.stringify({ text: 'x'.repeat(500) })
    expect(await readJson(post(big), Body, 100)).toEqual({ ok: false, status: 413 })
    expect(await readJson(post(big, { 'content-length': '5000' }), Body, 100)).toEqual({ ok: false, status: 413 })
  })

  it('answers 400 for broken JSON or a body the schema rejects', async () => {
    expect(await readJson(post('{nope'), Body, 100)).toEqual({ ok: false, status: 400 })
    expect(await readJson(post('{"text":""}'), Body, 100)).toEqual({ ok: false, status: 400 })
  })
})
