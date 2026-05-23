import { NextRequest, NextResponse } from "next/server"
import { isHaveValidToken } from "./app/actions/actions"

/** User API session (NATEE_V3_TOKEN) — not used for admin (Supabase cookie). */
const USER_PROTECTED_PREFIXES = ["/profile", "/ai"]
const AUTH_PUBLIC_PATHS = ["callback", "reset-password", "forgot-password"]

function isAdminPublicPath(pathname: string): boolean {
  return pathname.startsWith("/admin/auth")
}

function hasSessionToken(request: NextRequest): boolean {
  const nateeToken = request.cookies.get("NATEE_V3_TOKEN")?.value
  const authHeader = request.headers.get("authorization")
  return Boolean(nateeToken || authHeader?.startsWith("Bearer "))
}

export async function proxy(request: NextRequest, _response: NextResponse) {
  const { pathname } = request.nextUrl
  const isHaveToken = await isHaveValidToken()
  const adminCookieValue = request.cookies.get("ADMIN_SUPABASE_AUTH_COOKIE")
  const nateeToken = request.cookies.get("NATEE_V3_TOKEN")

  // Admin dashboard (Supabase admin session)
  if (
    (pathname.startsWith("/admin/dashboard") || pathname.startsWith("/admin/profile")) &&
    !adminCookieValue
  ) {
    return NextResponse.redirect(new URL("/admin/auth/login", request.url))
  }

  // User routes: /profile, /ai (API session token). Admin uses Supabase only (see above).
  if (isAdminPublicPath(pathname)) {
    return NextResponse.next()
  }

  const needsUserAuth = USER_PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  )
  if (needsUserAuth && !hasSessionToken(request)) {
    const login = new URL("/auth", request.url)
    login.searchParams.set("redirect", pathname)
    return NextResponse.redirect(login)
  }

  // Logged-in users skip login/signup (allow password reset flows)
  const isAuthPublicPath = AUTH_PUBLIC_PATHS.some((p) => pathname.includes(p))
  if (
    pathname.startsWith("/auth") &&
    (nateeToken || hasSessionToken(request)) &&
    !isAuthPublicPath
  ) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Legacy profile check (server action validation)
  if (pathname.startsWith("/profile") && !isHaveToken) {
    return NextResponse.redirect(new URL("/auth", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/auth/:path*",
    "/ai/:path*",
    "/chat/:path*",
    "/profile/:path*",
  ],
}
