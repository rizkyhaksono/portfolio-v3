import { redirect } from "next/navigation"

// Hidden until the API actually sends reset emails in production.
export default function ForgotPasswordPage() {
  redirect("/auth")
}
