"use client"

import { Card, CardContent } from "@/components/ui/card"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { authSignup } from "@/services/visitor/auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Typography from "@/components/ui/typography"
import { User, Mail, Lock, Loader2, CheckCircle2 } from "lucide-react"
import { useState } from "react"

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export default function SignupForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })

  const handleRegister = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    const promise = authSignup(values.email, values.password, values.name)
    toast.promise(promise, {
      loading: "Creating your account...",
      success: (res) => {
        if (res?.name === "CONFLICT") {
          toast.error("Email already exists!")
          router.push("/auth")
          return "Redirecting..."
        } else {
          router.refresh()
          return "Account created successfully! You can now log in."
        }
      },
      error: (err) => `Error: ${err.message}`,
      finally: () => setIsLoading(false),
    })
  }

  const features = ["Access personalized content", "Save your preferences", "Join the community"]

  return (
    <Card className="overflow-hidden border-0 shadow-xl">
      <CardContent className="grid p-0 md:grid-cols-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleRegister)} className="p-6 md:p-8">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col items-center text-center space-y-1">
                <Typography.H4 className="text-2xl font-bold">Create Account</Typography.H4>
                <Typography.P className="text-muted-foreground text-sm">Fill in the details below to get started</Typography.P>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">Full Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="John Doe" className="pl-10" {...field} />
                      </div>
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
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input type="password" placeholder="••••••••" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <p className="text-xs text-muted-foreground mt-1">Must be at least 8 characters</p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-11 font-medium" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
          </form>
        </Form>

        {/* Image Side with Features */}
        <div className="relative hidden bg-muted md:block">
          <Image src="https://i.pinimg.com/736x/d8/01/bd/d801bdf6c0a8102723413903f0565876.jpg" width={500} height={500} alt="Signup illustration" className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.4]" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-4">
            <div>
              <p className="text-lg font-semibold">Join us today</p>
              <p className="text-sm text-white/80">Create your account and unlock:</p>
            </div>
            <ul className="space-y-2">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-white/90">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
