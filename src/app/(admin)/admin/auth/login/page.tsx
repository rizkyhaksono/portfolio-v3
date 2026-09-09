import { AdminLoginForm } from "./_components/login-form"

export default function AdminAuthLoginPage() {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background p-4 sm:p-8">
      <div className="w-full max-w-3xl border-y border-border py-8">
        <AdminLoginForm />
      </div>
    </div>
  )
}
