import { AuthShell } from "@/components/layout/auth-shell"
import { OAuthCallback } from "../_components/oauth-callback"

export default function OAuthCallbackPage() {
  return (
    <AuthShell variant="narrow" title="Google sign-in">
      <OAuthCallback />
    </AuthShell>
  )
}
