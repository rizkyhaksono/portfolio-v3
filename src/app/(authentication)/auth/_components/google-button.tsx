"use client"

import { Button } from "@/components/ui/button"
import { safeRedirect } from "@/lib/utils"

/** sessionStorage key the OAuth callback reads; the API always returns to /auth/callback. */
export const OAUTH_RETURN_KEY = "oauth_return"

interface GoogleButtonProps {
  /** Where the callback lands. Defaults to the page's own `?redirect=`, read at click time so /auth stays static. */
  returnTo?: string
  disabled?: boolean
}

export function GoogleButton({ returnTo, disabled }: Readonly<GoogleButtonProps>) {
  const start = () => {
    const target = returnTo ?? safeRedirect(new URLSearchParams(window.location.search).get("redirect"))
    try {
      sessionStorage.setItem(OAUTH_RETURN_KEY, target)
    } catch {
      // Storage blocked: the callback falls back to the home page.
    }
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/v3/auth/google`
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={start}
      disabled={disabled}
      data-umami-event="signin-start"
      data-umami-event-method="google"
    >
      {/* Google's G in one ink: the brand colours are not ours to print. */}
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
      </svg>
      Continue with Google
    </Button>
  )
}
