import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import LoginForm from "./_components/login-form"
import SignupForm from "./_components/signup-form"
import { LogIn, UserPlus } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10 bg-gradient-to-br from-background via-background to-muted/30">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm md:max-w-3xl">
        <div className={cn("flex flex-col gap-6")}>
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome</h1>
            <p className="text-muted-foreground">Sign in to your account or create a new one</p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 h-12">
              <TabsTrigger value="login" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                <LogIn className="h-4 w-4" />
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
                <UserPlus className="h-4 w-4" />
                Register
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="mt-0">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register" className="mt-0">
              <SignupForm />
            </TabsContent>
          </Tabs>

          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary [&_a]:transition-colors">
            By clicking continue, you agree to our <Link href="/legal/terms">Terms of Service</Link> and <Link href="/legal/privacy">Privacy Policy</Link>.
          </div>
        </div>
      </div>
    </div>
  )
}
