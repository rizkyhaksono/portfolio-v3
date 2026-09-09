"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eyebrow } from "@/components/ui/eyebrow"
import { FcGoogle } from "react-icons/fc"
import { ArrowLeft, Loader2, Lock, Mail, Shield } from "lucide-react"
import { toast } from "sonner"
import {
  loginWithCredentials,
  getCurrentUserWithToken,
  getOAuthLoginUrl,
} from "@/services/admin/auth-service"

interface OAuthProviderConfig {
  name: string
  icon: React.ComponentType<{ className?: string }>
  provider: string
  className: string
}

// Admin sign-in is Google-only by design (smaller OAuth attack surface).
const oauthProviders: OAuthProviderConfig[] = [
  {
    name: "Google",
    icon: FcGoogle,
    provider: "google",
    className: "hover:bg-muted/80",
  },
]

export function AdminLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data = await loginWithCredentials({ email, password })

      if (!data.token) {
        throw new Error("No authentication token received")
      }

      const userData = await getCurrentUserWithToken(data.token)
      const userRole = userData.data?.role

      if (userRole !== "ADMIN") {
        throw new Error("Access denied. Admin privileges required.")
      }

      // 7-day lifetime + SameSite=Lax; Secure whenever served over HTTPS (prod).
      const cookieExpiry = 60 * 60 * 24 * 7
      const secure = globalThis.location?.protocol === "https:" ? "; Secure" : ""
      const attrs = `; path=/; max-age=${cookieExpiry}; SameSite=Lax${secure}`
      document.cookie = `NATEE_V3_TOKEN=${data.token}${attrs}`
      document.cookie = `ADMIN_SUPABASE_AUTH_COOKIE=true${attrs}`

      toast.success("Login successful!")
      router.push("/admin/dashboard")
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Invalid credentials. Please try again."
      toast.error("Login Failed", { description: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthLogin = (provider: string) => {
    sessionStorage.setItem("admin_oauth_return", "/admin/dashboard")
    globalThis.location.href = getOAuthLoginUrl(provider)
  }

  return (
    <Card className="overflow-hidden border border-border bg-card shadow-none">
      <CardContent className="p-0">
        {/* Form panel */}
        <div className="flex flex-col p-6 sm:p-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to portfolio
          </Link>

          <div className="flex flex-col gap-1 mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex h-9 w-9 items-center justify-center border border-border bg-muted text-primary">
                <Shield className="h-5 w-5" />
              </span>
              <Eyebrow>Admin</Eyebrow>
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight">Sign in</h1>
            <p className="text-sm text-muted-foreground">
              Manage projects, blog, and portfolio content.
            </p>
          </div>

          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4 flex-1">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-background"
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="admin-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 bg-background"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-11 font-medium mt-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in to dashboard"
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase tracking-wide">
              <span className="bg-card px-3 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid gap-2">
            {oauthProviders.map((provider) => (
              <Button
                key={provider.provider}
                variant="outline"
                type="button"
                onClick={() => handleOAuthLogin(provider.provider)}
                className={`h-10 w-full transition-colors ${provider.className}`}
                disabled={isLoading}
              >
                <provider.icon className="mr-2 h-4 w-4 shrink-0" />
                <span className="truncate">Continue with {provider.name}</span>
              </Button>
            ))}
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
