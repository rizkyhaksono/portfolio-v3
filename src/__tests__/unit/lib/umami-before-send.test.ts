import { UMAMI_BEFORE_SEND } from '@/lib/umami-before-send'

type Payload = { url?: string; referrer?: string }
const beforeSend = new Function(`${UMAMI_BEFORE_SEND}; return umamiBeforeSend`)() as (
  type: string,
  payload: Payload,
) => Payload | false
const clean = (payload: Payload) => beforeSend('event', payload) as Payload

describe('umamiBeforeSend', () => {
  it('keeps the path but drops the token query', () => {
    expect(beforeSend('event', { url: 'https://natee.my.id/auth/callback?token=x' })).toEqual({
      url: 'https://natee.my.id/auth/callback',
      referrer: undefined,
    })
    expect(clean({ url: '/auth/callback?token=x' }).url).toBe('/auth/callback')
  })

  it('drops admin pages', () => {
    expect(beforeSend('event', { url: 'https://natee.my.id/admin/dashboard' })).toBe(false)
    expect(beforeSend('event', { url: '/admin' })).toBe(false)
    expect(beforeSend('event', { url: '/administrator' })).not.toBe(false)
  })

  it('keeps only utm_* and ref params', () => {
    expect(clean({ url: '/blog/x?utm_source=a&id=3' }).url).toBe('/blog/x?utm_source=a')
    expect(clean({ url: '/blog/x?ref=hn&q=1' }).url).toBe('/blog/x?ref=hn')
  })

  it('collapses chat ids', () => {
    expect(clean({ url: 'https://natee.my.id/ai/abc123' }).url).toBe('https://natee.my.id/ai/[id]')
  })

  it('cleans the referrer', () => {
    expect(
      clean({
        url: '/',
        referrer: 'https://natee.my.id/auth/reset-password?token=secret&utm_medium=mail',
      }).referrer,
    ).toBe('https://natee.my.id/auth/reset-password?utm_medium=mail')
    expect(clean({ url: '/', referrer: '' }).referrer).toBe('')
    expect(clean({ url: '/', referrer: 'android-app://com.google.android.gm/?x=1' }).referrer).toBe(
      'android-app://com.google.android.gm/',
    )
  })
})
