"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormAlert } from "@/app/(authentication)/auth/_components/form-alert"
import { GoogleButton } from "@/app/(authentication)/auth/_components/google-button"
import { adminSignIn } from "@/services/visitor/auth"

const UNREACHABLE = "The account server is not answering. Try again in a minute."

// Admin sign-in is email or Google only by design (smaller OAuth attack surface).
export function AdminLoginForm() {
  const router = useRouter()
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string>()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setPending(true)
    setError(undefined)

    const result = await adminSignIn(String(data.get("email")), String(data.get("password"))).catch(() => null)
    if (result?.ok) {
      router.push("/admin/dashboard")
      return
    }
    setError(result?.message ?? UNREACHABLE)
    setPending(false)
  }

  return (
    <div className="flex flex-col gap-8">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6" aria-busy={pending}>
        <div className="space-y-2">
          <Label htmlFor="admin-email">Email</Label>
          <Input id="admin-email" name="email" type="email" autoComplete="email" required disabled={pending} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-password">Password</Label>
          <Input id="admin-password" name="password" type="password" autoComplete="current-password" required disabled={pending} />
        </div>

        <FormAlert>{error}</FormAlert>

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign in to the dashboard"}
        </Button>
      </form>

      <p className="flex items-center gap-4 font-display text-caption text-ink-soft before:h-px before:flex-1 before:bg-rule before:content-[''] after:h-px after:flex-1 after:bg-rule after:content-['']">
        or
      </p>

      <GoogleButton returnTo="/admin/dashboard" disabled={pending} />
    </div>
  )
}
