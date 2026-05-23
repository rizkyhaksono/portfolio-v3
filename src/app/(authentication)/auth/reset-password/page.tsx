"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { toast } from "sonner"
import { confirmPasswordReset } from "@/services/visitor/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2, Lock } from "lucide-react"

const schema = z
  .object({
    password: z.string().min(8),
    confirm: z.string().min(8),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  })

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token") ?? ""
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirm: "" },
  })

  const onSubmit = async (values: z.infer<typeof schema>) => {
    if (!token) {
      toast.error("Missing reset token")
      return
    }
    setLoading(true)
    try {
      const res = await confirmPasswordReset(token, values.password)
      if (res.status === 200) {
        toast.success("Password updated. You can log in now.")
        router.push("/auth")
      } else {
        toast.error(res.message ?? "Reset failed")
      }
    } catch {
      toast.error("Reset failed")
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <p className="text-sm text-muted-foreground">
        Invalid link.{" "}
        <Link href="/auth/forgot-password" className="text-primary underline">
          Request a new reset
        </Link>
      </p>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="password" className="pl-10" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
        </Button>
      </form>
    </Form>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-xl font-semibold">Reset password</h1>
          <Suspense fallback={<p className="text-sm text-muted-foreground">Loading...</p>}>
            <ResetPasswordForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
