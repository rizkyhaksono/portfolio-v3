"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { completeOAuthSignin } from "@/services/visitor/auth"
import { track } from "@/lib/analytics"
import { safeRedirect } from "@/lib/utils"
import { FormAlert } from "./form-alert"
import { OAUTH_RETURN_KEY } from "./google-button"

function takeReturnPath() {
  try {
    const path = sessionStorage.getItem(OAUTH_RETURN_KEY)
    sessionStorage.removeItem(OAUTH_RETURN_KEY)
    return safeRedirect(path)
  } catch {
    return "/"
  }
}

/** Takes the session token out of the address bar at once, checks it, then returns to where sign-in started. */
export function OAuthCallback() {
  const router = useRouter()
  // The sign-in page to go back to once the check fails (admin or visitor); null while checking.
  const [retryHref, setRetryHref] = useState<string | null>(null)
  const started = useRef(false)

  useEffect(() => {
    // Strict Mode runs effects twice; the token is single use once it leaves the URL.
    if (started.current) return
    started.current = true

    const token = new URLSearchParams(window.location.search).get("token") ?? ""
    window.history.replaceState(null, "", window.location.pathname)
    const returnTo = takeReturnPath()

    completeOAuthSignin(token)
      .catch(() => false)
      .then((ok) => {
        if (!ok) return setRetryHref(returnTo.startsWith("/admin") ? "/admin/auth/login" : "/auth")
        track("signin-complete", { method: "google" })
        router.replace(returnTo)
      })
  }, [router])

  if (!retryHref) {
    return (
      <p role="status" className="font-display text-lead text-ink-soft">
        Checking your Google session…
      </p>
    )
  }

  return (
    <div className="flex flex-col items-start gap-6">
      <FormAlert>Google sign-in did not finish. The link may have expired, or the account server is not answering.</FormAlert>
      <Button asChild>
        <Link href={retryHref}>Back to sign in</Link>
      </Button>
    </div>
  )
}
