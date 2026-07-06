"use client"

import { Card, CardContent } from "@/components/ui/card"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { authLogin } from "@/services/visitor/auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { storeCookie } from "@/app/actions/actions"
import Link from "next/link"
import Typography from "@/components/ui/typography"
import { Eyebrow } from "@/components/ui/eyebrow"
import { FcGoogle } from "react-icons/fc"
import { Mail, Lock, Loader2, Check } from "lucide-react"
import { useState } from "react"

const MONO_LABEL = "font-mono text-[11px] font-medium uppercase tracking-[0.15em] text-muted-foreground"

const PERKS = ["Saved Etan AI chats & history", "Join the realtime public chat", "Personalized experience"]

const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export default function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    toast.promise(authLogin(values.email, values.password), {
      loading: "Logging in...",
      success: async (response) => {
        // Handle error responses
        if (response?.name === "BAD_REQUEST" || response?.name === "UNAUTHORIZED") {
          throw new Error(response.message || "Login failed")
        }

        // Handle successful login
        if (response?.status === "200" && response?.token) {
          await storeCookie("NATEE_V3_TOKEN", response.token)

          // Also store user info for chat (if available)
          if (globalThis.window !== undefined) {
            const userInfo = {
              id: response.userId || response.user?.id || "",
              name: response.userName || response.user?.name || values.email.split("@")[0],
              accessToken: response.token,
            }
            localStorage.setItem("chat_user", JSON.stringify(userInfo))
          }

          router.push("/")
          return "Welcome back!"
        }

        // Unexpected response format
        throw new Error("Unexpected response from server")
      },
      error: (err) => {
        setIsLoading(false)
        if (err instanceof Error) {
          return err.message
        }
        return "Login failed. Please try again."
      },
      finally: () => setIsLoading(false),
    })
  }

  const handleOAuthLogin = (provider: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    globalThis.window.location.href = `${API_URL}/v3/auth/${provider}`
  }

  // Google-only sign-in (GitHub/Discord/Facebook intentionally disabled).
  const oauthProviders = [
    {
      name: "Google",
      icon: FcGoogle,
      provider: "google",
      className: "hover:bg-accent",
      status: "supported",
    },
  ]

  return (
    <Card className="overflow-hidden border border-border shadow-none">
      <CardContent className="grid p-0 md:grid-cols-2 gap-0">
        {/* Brand panel */}
        <div className="relative hidden flex-col justify-between border-r border-border bg-secondary/40 p-8 md:flex">
          <Eyebrow>Rizky Haksono · Portfolio</Eyebrow>
          <div className="space-y-5">
            <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-tight text-balance">
              Everything in <Typography.Em>one</Typography.Em> place.
            </h2>
            <ul className="flex flex-col gap-3">
              {PERKS.map((perk) => (
                <li key={perk} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>
          <Eyebrow>© 2026 Rizky Haksono</Eyebrow>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="p-6 md:p-8">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <Eyebrow>Sign in</Eyebrow>
                <Typography.H4 className="font-display text-2xl font-bold tracking-tight">Sign in to your account</Typography.H4>
                <Typography.P className="text-muted-foreground text-sm">Access your saved chats and personalization.</Typography.P>
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email" className={MONO_LABEL}>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="you@example.com" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel htmlFor="password" className={MONO_LABEL}>Password</FormLabel>
                      <Link href="/auth/forgot-password" className="text-xs text-muted-foreground hover:text-foreground hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-11 font-medium" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              {/* OAuth Providers */}
              <div className="grid gap-2">
                {oauthProviders.map((provider) => (
                  <Button
                    key={provider.provider}
                    variant="outline"
                    type="button"
                    onClick={() => handleOAuthLogin(provider.provider)}
                    className={`w-full transition-colors ${provider.className}`}
                    disabled={provider.status === "not_supported"}
                  >
                    <provider.icon className="mr-2 h-4 w-4" />
                    Continue with {provider.name}
                  </Button>
                ))}
              </div>
            </div>
          </form>
        </Form>

      </CardContent>
    </Card>
  )
}
