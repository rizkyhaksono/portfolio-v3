/**
 * @jest-environment node
 */
import { NextRequest } from 'next/server'
import { POST as chat } from '@/app/api/ai/route'
import { POST as ocr } from '@/app/api/ai/ocr/route'
import { POST as jdMatch } from '@/app/api/ai/jd-match/route'

// Etan AI is switched off: the proxies answer 404 before touching the backend.
describe('Etan AI proxies', () => {
  const fetchSpy = jest.spyOn(global, 'fetch')

  it.each([
    ['/api/ai', chat],
    ['/api/ai/ocr', ocr],
    ['/api/ai/jd-match', jdMatch],
  ])('%s answers 404', async (path, handler) => {
    const res = await handler(new NextRequest(`http://site.test${path}`, { method: 'POST', body: '{}' }))
    expect(res.status).toBe(404)
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})
