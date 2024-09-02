"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCookieValue, setCookieValue } from "@/commons/helpers/cookies"
import { supabaseUser } from "@/supabase/server"

export default function AdminAuthLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<any>(null)
  const router = useRouter()

  const checkUser = useCallback(async () => {
    const cookie = await getCookieValue("ADMIN_SUPABASE_AUTH_COOKIE")
    if (cookie) {
      router.push("/admin/dashboard")
    }
  }, [router])

  const handleAdminLogin = async () => {
    try {
      const { data, error } = await supabaseUser.auth.signInWithPassword({
        email: email,
        password: password,
      })
      if (error) {
        throw error
      }
      console.log("Registration successful:", data)
      if (data?.user?.role == "admin") {
        setCookieValue("ADMIN_SUPABASE_AUTH_COOKIE", data?.session?.access_token)
        router.push("/admin/dashboard")
      } else {
        setError("Invalid admin account")
      }
    } catch (error: any) {
      setError(error.message)
      console.error("Registration error:", error.message)
    }
  }

  useEffect(() => {
    checkUser()
  }, [checkUser])

  return (
    <div className="container relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 max-[766px]:mt-40">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900"></div>
        <a className="relative z-20 flex items-center text-lg font-medium" href="/">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-6 w-6">
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3"></path>
          </svg>
          RH
        </a>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">“This library has saved me countless hours of work and helped me deliver stunning designs to my clients faster than ever before.”</p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Login an admin account</h1>
            <p className="text-sm text-muted-foreground">Enter your email below to login to admin account</p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@example.com" required onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input id="password" type="password" placeholder="********" required onChange={(e) => setPassword(e.target.value)} />
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <Button type="submit" className="w-full" onClick={handleAdminLogin}>
              Login to admin account
            </Button>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <a className="underline underline-offset-4 hover:text-primary" href="#">
              Terms of Service
            </a>{" "}
            and{" "}
            <a className="underline underline-offset-4 hover:text-primary" href="#">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
