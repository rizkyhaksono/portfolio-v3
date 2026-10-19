"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { authLogin } from "@/services/visitor/auth"
import { track } from "@/lib/analytics"
import { safeRedirect } from "@/lib/utils"
import { FormAlert } from "./form-alert"
import { GoogleButton } from "./google-button"

const formSchema = z.object({
  email: z.string().email("Enter an email address, like you@example.com."),
  password: z.string().min(8, "Passwords have at least 8 characters."),
})

interface LoginFormProps {
  /** Set right after signup: prefills the email and says the account is ready. */
  createdEmail?: string
}

export default function LoginForm({ createdEmail }: Readonly<LoginFormProps>) {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: createdEmail ?? "", password: "" },
  })
  const { isSubmitting, errors } = form.formState

  const handleLogin = async (values: z.infer<typeof formSchema>) => {
    track("signin-start", { method: "email" })
    const result = await authLogin(values.email, values.password).catch(() => null)
    if (!result?.ok) {
      form.setError("root", { message: result?.message ?? "Sign-in is not answering right now. Try again in a minute." })
      return
    }
    track("signin-complete", { method: "email" })
    // Read at submit time so /auth stays static.
    router.push(safeRedirect(new URLSearchParams(window.location.search).get("redirect")))
  }

  return (
    <div className="flex flex-col gap-8">
      {createdEmail && <p className="text-body text-ink">Your account is ready. Sign in with the password you just chose.</p>}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} noValidate className="flex flex-col gap-6" aria-busy={isSubmitting}>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" placeholder="you@example.com" {...field} />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="current-password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormAlert>{errors.root?.message}</FormAlert>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Form>

      <p className="flex items-center gap-4 font-display text-caption text-ink-soft before:h-px before:flex-1 before:bg-rule before:content-[''] after:h-px after:flex-1 after:bg-rule after:content-['']">
        or
      </p>

      <GoogleButton disabled={isSubmitting} />
    </div>
  )
}
