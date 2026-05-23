"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { toast } from "sonner"
import { requestPasswordReset } from "@/services/visitor/auth"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Mail, ArrowLeft, Copy, Check } from "lucide-react"

const schema = z.object({
  email: z.string().email(),
})

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [resetUrl, setResetUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  })

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setLoading(true)
    setResetUrl(null)
    try {
      const res = await requestPasswordReset(values.email)
      if (res.resetUrl) setResetUrl(res.resetUrl)
      toast.success(res.message ?? "Check your email for reset instructions.")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Request failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-6 space-y-4">
          <Link href="/auth" className="text-sm text-muted-foreground inline-flex items-center gap-1 hover:underline">
            <ArrowLeft className="h-3 w-3" />
            Back to login
          </Link>
          <h1 className="text-xl font-semibold">Forgot password</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-10" placeholder="you@example.com" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send reset link"}
              </Button>
            </form>
          </Form>
          {resetUrl && (
            <Alert className="border-primary/30 bg-primary/5">
              <AlertTitle>Development reset link</AlertTitle>
              <AlertDescription className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Email is not configured in development. Use this link to reset your password (expires in 1 hour):
                </p>
                <Link href={resetUrl} className="block text-sm font-medium text-primary underline break-all">
                  {resetUrl}
                </Link>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={async () => {
                    await navigator.clipboard.writeText(resetUrl)
                    setCopied(true)
                    toast.success("Link copied to clipboard")
                    setTimeout(() => setCopied(false), 2000)
                  }}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied" : "Copy link"}
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
