"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { setCookieValue } from "@/commons/helpers/cookies"
import { useCheckAdmin } from "@/commons/helpers/check"
import { loginAdmin } from "@/services/admin/auth"
import Link from "next/link"

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  useCheckAdmin();

  const handleAdminLogin = async () => {
    try {
      const data = await loginAdmin({ email, password });
      if (data?.session?.access_token) {
        setCookieValue("ADMIN_SUPABASE_AUTH_COOKIE", data?.session?.access_token);
        router.push("/admin/dashboard");
      }
    } catch (error: any) {
      setError(error.message || "Login failed");
    }
  };

  return (
    <div className="container flex h-screen items-center justify-center relative flex-col md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900"></div>
        <Link className="relative z-20 flex items-center text-lg font-medium" href="/">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-6 w-6">
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"></path>
          </svg>
          RH
        </Link>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              “This library has saved me countless hours of work and helped me deliver stunning designs to my clients faster than ever before.”
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Login an admin account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to login to admin account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">
                  Password
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="********"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button
              type="submit"
              className="w-full mt-4"
              onClick={handleAdminLogin}
            >
              Login to admin account
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
