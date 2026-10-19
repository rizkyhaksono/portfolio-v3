"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoginForm from "./login-form"
import SignupForm from "./signup-form"

/** Sign in and Create account, with the open tab in `?tab=` (other params such as `redirect` are kept). */
export function AuthTabs() {
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") === "signup" ? "signup" : "signin"
  const [createdEmail, setCreatedEmail] = useState<string>()

  // Native history calls sync useSearchParams without a server round trip.
  const show = (next: string) => {
    const params = new URLSearchParams(searchParams)
    params.set("tab", next)
    window.history.replaceState(null, "", `?${params}`)
  }

  return (
    <Tabs value={tab} onValueChange={show}>
      <TabsList aria-label="Account">
        <TabsTrigger value="signin">Sign in</TabsTrigger>
        <TabsTrigger value="signup">Create an account</TabsTrigger>
      </TabsList>
      <TabsContent value="signin" className="mt-8">
        <LoginForm createdEmail={createdEmail} />
      </TabsContent>
      <TabsContent value="signup" className="mt-8">
        <SignupForm
          onCreated={(email) => {
            setCreatedEmail(email)
            show("signin")
          }}
        />
      </TabsContent>
    </Tabs>
  )
}
