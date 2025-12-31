"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { storeCookie } from "@/app/actions/actions"
import { toast } from "sonner"

export default function OAuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams.get("token")

      if (!token) {
        toast.error("Authentication failed. No token received.")
        router.push("/auth")
        return
      }

      try {
        // Store the token
        await storeCookie("NATEE_V3_TOKEN", token)

        // Fetch user profile to verify authentication
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v3/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const userData = await response.json()

          // Store user info for chat if needed
          if (globalThis.window !== undefined && userData?.data) {
            const userInfo = {
              id: userData.data.id,
              name: userData.data.name,
              accessToken: token,
            }
            localStorage.setItem("chat_user", JSON.stringify(userInfo))
          }

          toast.success("Successfully logged in!")
          router.push("/")
        } else {
          throw new Error("Failed to fetch user profile")
        }
      } catch (error) {
        console.error("OAuth callback error:", error)
        toast.error("Authentication failed. Please try again.")
        router.push("/auth")
      }
    }

    handleCallback()
  }, [searchParams, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-lg">Completing authentication...</p>
      </div>
    </div>
  )
}
