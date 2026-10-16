import { redirect } from "next/navigation"

// Hidden with forgot-password until the API actually sends reset emails in production.
export default function ResetPasswordPage() {
  redirect("/auth")
}
