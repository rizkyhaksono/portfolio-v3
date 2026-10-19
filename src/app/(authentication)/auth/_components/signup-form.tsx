"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { authSignup } from "@/services/visitor/auth"
import { track } from "@/lib/analytics"
import { FormAlert } from "./form-alert"

const formSchema = z.object({
  name: z.string().trim().min(3, "Names have at least 3 characters."),
  email: z.string().email("Enter an email address, like you@example.com."),
  password: z.string().min(8, "That password is too short."),
})

interface SignupFormProps {
  /** Called with the new account's email so the sign-in tab can take over. */
  onCreated: (email: string) => void
}

export default function SignupForm({ onCreated }: Readonly<SignupFormProps>) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", password: "" },
  })
  const { isSubmitting, errors } = form.formState

  const handleRegister = async (values: z.infer<typeof formSchema>) => {
    const result = await authSignup(values.email, values.password, values.name).catch(() => null)
    track("signup-complete", { status: result?.ok ? "ok" : result?.exists ? "exists" : "error" })

    if (result?.ok) return onCreated(values.email)
    form.setError("root", {
      message: result?.exists
        ? "This email already has an account. Sign in instead."
        : result?.message ?? "The account was not created. Try again in a minute.",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegister)} noValidate className="flex flex-col gap-6" aria-busy={isSubmitting}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input autoComplete="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                <Input type="password" autoComplete="new-password" {...field} />
              </FormControl>
              <FormDescription>At least 8 characters.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormAlert>{errors.root?.message}</FormAlert>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating your account…" : "Create account"}
        </Button>
      </form>
    </Form>
  )
}
