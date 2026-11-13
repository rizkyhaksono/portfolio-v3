import { NextRequest, NextResponse } from "next/server"
import { buildContentSecurityPolicy } from "@/lib/content-security-policy"
import { SESSION_COOKIE } from "./lib/session"

/** User API session (NATEE_V3_TOKEN) — not used for admin (Supabase cookie).
 * /ai is intentionally NOT gated: logged-out visitors see a preview of the chat UI,
 * and the chat API itself stays auth-protected server-side. */
const USER_PROTECTED_PREFIXES = ["/profile"]
const AUTH_PUBLIC_PATHS = ["callback", "reset-password", "forgot-password"]

function isAdminPublicPath(pathname: string): boolean {
  return pathname.startsWith("/admin/auth")
}

function hasSessionToken(request: NextRequest): boolean {
  const nateeToken = request.cookies.get(SESSION_COOKIE)?.value
  const authHeader = request.headers.get("authorization")
  return Boolean(nateeToken || authHeader?.startsWith("Bearer "))
}

/** Forwards the request with a per-response CSP nonce (see Next.js CSP guide). */
function continueWithCsp(request: NextRequest): NextResponse {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64")
  const csp = buildContentSecurityPolicy(nonce)
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("x-nonce", nonce)
  requestHeaders.set("Content-Security-Policy", csp)
  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set("Content-Security-Policy", csp)
  return response
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Admin dashboard: require the main session (works for SSO/Google + email login).
  // The actual ADMIN role is enforced server-side in the dashboard layout.
  if (
    (pathname.startsWith("/admin/dashboard") || pathname.startsWith("/admin/profile")) &&
    !hasSessionToken(request)
  ) {
    return NextResponse.redirect(new URL("/admin/auth/login", request.url))
  }

  // User routes: /profile, /ai (API session token). Admin uses Supabase only (see above).
  if (!isAdminPublicPath(pathname)) {
    const needsUserAuth = USER_PROTECTED_PREFIXES.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    )
    if (needsUserAuth && !hasSessionToken(request)) {
      const login = new URL("/auth", request.url)
      login.searchParams.set("redirect", pathname)
      return NextResponse.redirect(login)
    }
  }

  // Logged-in users skip login/signup (allow password reset flows). A `redirect` param means the
  // app sent them here after a 401, so the cookie is stale and they must reach the form.
  const isAuthPublicPath = AUTH_PUBLIC_PATHS.some((p) => pathname.includes(p))
  if (
    pathname.startsWith("/auth") &&
    hasSessionToken(request) &&
    !isAuthPublicPath &&
    !request.nextUrl.searchParams.has("redirect")
  ) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return continueWithCsp(request)
}

export const config = {
  matcher: [
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|ico|webp|png|jpg|jpeg|gif|woff|woff2)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
    "/admin/:path*",
    "/auth/:path*",
    "/chat/:path*",
    "/profile/:path*",
  ],
}
