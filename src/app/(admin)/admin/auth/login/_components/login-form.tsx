"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormAlert } from "@/app/(authentication)/auth/_components/form-alert"
import { GoogleButton } from "@/app/(authentication)/auth/_components/google-button"
import { loginWithCredentials, getCurrentUserWithToken } from "@/services/admin/auth-service"

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

    try {
      const { token } = await loginWithCredentials({
        email: String(data.get("email")),
        password: String(data.get("password")),
      })
      if (!token) throw new Error("The server did not open a session. Try again.")

      const user = await getCurrentUserWithToken(token)
      if (user.data?.role !== "ADMIN") throw new Error("This account is not an administrator.")

      // 7-day lifetime + SameSite=Lax; Secure whenever served over HTTPS (prod).
      const secure = globalThis.location?.protocol === "https:" ? "; Secure" : ""
      const attrs = `; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${secure}`
      document.cookie = `NATEE_V3_TOKEN=${token}${attrs}`
      document.cookie = `ADMIN_SUPABASE_AUTH_COOKIE=true${attrs}`
      router.push("/admin/dashboard")
    } catch (err) {
      // fetch rejects with a TypeError when the API is unreachable; its message is not for people.
      setError(err instanceof Error && !(err instanceof TypeError) ? err.message : UNREACHABLE)
      setPending(false)
    }
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
