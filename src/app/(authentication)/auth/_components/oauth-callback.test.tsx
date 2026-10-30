import { render, screen, waitFor } from '@testing-library/react'
import { OAuthCallback } from './oauth-callback'
import { OAUTH_RETURN_KEY } from './google-button'
import { completeOAuthSignin } from '@/services/visitor/auth'

const replace = jest.fn()
jest.mock('next/navigation', () => ({ useRouter: () => ({ replace }) }))
jest.mock('@/services/visitor/auth', () => ({ completeOAuthSignin: jest.fn() }))
jest.mock('@/lib/analytics', () => ({ track: jest.fn() }))

const complete = completeOAuthSignin as jest.MockedFunction<typeof completeOAuthSignin>

describe('OAuthCallback', () => {
  beforeEach(() => {
    replace.mockReset()
    complete.mockReset()
    sessionStorage.clear()
    window.history.replaceState(null, '', '/auth/callback?code=one-time-code')
  })

  it('clears the code from the address bar, trades it on the server and returns to the stored path', async () => {
    complete.mockResolvedValue(true)
    sessionStorage.setItem(OAUTH_RETURN_KEY, '/admin/dashboard')
    render(<OAuthCallback />)

    expect(window.location.search).toBe('')
    expect(complete).toHaveBeenCalledWith({ code: 'one-time-code' })
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/admin/dashboard'))
    expect(sessionStorage.getItem(OAUTH_RETURN_KEY)).toBeNull()
  })

  it('never passes a session token from the URL to the exchange', async () => {
    complete.mockResolvedValue(false)
    sessionStorage.setItem(OAUTH_RETURN_KEY, '/')
    window.history.replaceState(null, '', '/auth/callback?token=secret')
    render(<OAuthCallback />)

    expect(window.location.search).toBe('')
    expect(complete).toHaveBeenCalledWith({ code: undefined })
    expect(await screen.findByRole('alert')).toBeInTheDocument()
  })

  it('refuses a callback that did not start in this tab', async () => {
    render(<OAuthCallback />)

    expect(window.location.search).toBe('')
    expect(await screen.findByRole('alert')).toHaveTextContent(/did not finish/)
    expect(complete).not.toHaveBeenCalled()
  })

  it('refuses an off-site return path', async () => {
    complete.mockResolvedValue(true)
    sessionStorage.setItem(OAUTH_RETURN_KEY, '//evil.example')
    render(<OAuthCallback />)
    await waitFor(() => expect(replace).toHaveBeenCalledWith('/'))
  })

  it('fails inline and points admins back to their own sign-in', async () => {
    complete.mockResolvedValue(false)
    sessionStorage.setItem(OAUTH_RETURN_KEY, '/admin/dashboard')
    render(<OAuthCallback />)

    expect(await screen.findByRole('alert')).toHaveTextContent(/did not finish/)
    expect(screen.getByRole('link', { name: 'Back to sign in' })).toHaveAttribute('href', '/admin/auth/login')
    expect(replace).not.toHaveBeenCalled()
  })
})
