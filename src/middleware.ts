import { NextRequest, NextResponse } from "next/server"
import { isHaveValidToken } from "./app/actions/actions"

export async function middleware(request: NextRequest, response: NextResponse) {
  const isHaveToken = await isHaveValidToken();
  const userCookieValue = request.cookies.get("USER_SUPABASE_AUTH_COOKIE")
  const adminCookieValue = request.cookies.get("ADMIN_SUPABASE_AUTH_COOKIE")

  if ((request.nextUrl.pathname.startsWith("/admin/dashboard") || request.nextUrl.pathname.startsWith("/admin/profile")) && !adminCookieValue) {
    return NextResponse.redirect(new URL("/admin/auth/login", request.url))
  }

  if (request.nextUrl.pathname.startsWith("/chat") && !userCookieValue) {
    return NextResponse.redirect(new URL("/auth", request.url))
  }

  if (request.nextUrl.pathname.startsWith("/profile") && !isHaveToken) {
    return NextResponse.redirect(new URL("/auth", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/chat/:path*",
    "/profile/:path*",
  ],
}
