"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import LoginForm from "./login-form"
import SignupForm from "./signup-form"

export type AuthMode = "signin" | "signup"

/** Sign in or create an account, Notion style: one form at a time, a line under it to switch (`?tab=` keeps `redirect`). */
export function AuthPanel() {
  const searchParams = useSearchParams()
  const [mode, setMode] = useState<AuthMode>(searchParams.get("tab") === "signup" ? "signup" : "signin")
  const [createdEmail, setCreatedEmail] = useState<string>()

  // Native history calls keep the URL in step without a server round trip.
  const show = (next: AuthMode) => {
    const params = new URLSearchParams(searchParams)
    params.set("tab", next)
    window.history.replaceState(null, "", `?${params}`)
    setMode(next)
  }

  const switchLink = "font-medium text-foreground underline decoration-foreground/40 underline-offset-[0.2em] hover:decoration-foreground"

  return (
    <div>
      {mode === "signin" ? (
        <LoginForm createdEmail={createdEmail} />
      ) : (
        <SignupForm
          onCreated={(email) => {
            setCreatedEmail(email)
            show("signin")
          }}
        />
      )}
      <p className="mt-8 text-center text-small text-muted-foreground">
        {mode === "signin" ? "New here? " : "Have an account? "}
        <button type="button" onClick={() => show(mode === "signin" ? "signup" : "signin")} className={switchLink}>
          {mode === "signin" ? "Create an account" : "Sign in"}
        </button>
      </p>
    </div>
  )
}
