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
import Image from "next/image"
import Typography from "@/components/ui/typography"
import { FcGoogle } from "react-icons/fc"
import { FaGithub, FaDiscord, FaFacebook } from "react-icons/fa"
import { Mail, Lock, Loader2 } from "lucide-react"
import { useState } from "react"

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

  const oauthProviders = [
    {
      name: "Google",
      icon: FcGoogle,
      provider: "google",
      className: "hover:bg-red-50 dark:hover:bg-red-950/20",
      status: "supported",
    },
    {
      name: "GitHub",
      icon: FaGithub,
      provider: "github",
      className: "hover:bg-gray-100 dark:hover:bg-gray-800",
      status: "not_supported",
    },
    {
      name: "Discord",
      icon: FaDiscord,
      provider: "discord",
      className: "hover:bg-indigo-50 dark:hover:bg-indigo-950/20",
      status: "not_supported",
    },
    {
      name: "Facebook",
      icon: FaFacebook,
      provider: "facebook",
      className: "hover:bg-blue-50 dark:hover:bg-blue-950/20",
      status: "not_supported",
    },
  ]

  return (
    <Card className="overflow-hidden border-0 shadow-xl">
      <CardContent className="grid p-0 md:grid-cols-2 gap-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleLogin)} className="p-6 md:p-8">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col items-center text-center space-y-1">
                <Typography.H4 className="text-2xl font-bold">Welcome back</Typography.H4>
                <Typography.P className="text-muted-foreground text-sm">Login to access your personalized experience</Typography.P>
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">Email</FormLabel>
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
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <button type="button" className="text-xs text-primary hover:underline" onClick={() => toast.info("Password reset coming soon!")}>
                        Forgot password?
                      </button>
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
              <div className="grid grid-cols-2 gap-2">
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
                    {provider.name}
                  </Button>
                ))}
              </div>
            </div>
          </form>
        </Form>

        {/* Image Side */}
        <div className="relative hidden bg-muted md:block">
          <Image src="https://i.pinimg.com/736x/a0/f5/cd/a0f5cdfbb60d16bd37ebc10c18e8da89.jpg" width={500} height={500} alt="Login illustration" className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.4]" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <p className="text-lg font-semibold">Start your journey</p>
            <p className="text-sm text-white/80">Access all features with your account</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
