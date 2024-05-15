import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest, response: NextResponse) {
  const userCookieValue = request.cookies.get("USER_SUPABASE_AUTH_COOKIE")
  const adminCookieValue = request.cookies.get("ADMIN_SUPABASE_AUTH_COOKIE")

  if ((request.nextUrl.pathname.startsWith("/admin/dashboard") || request.nextUrl.pathname.startsWith("/admin/profile")) && !adminCookieValue) {
    return NextResponse.redirect(new URL("/admin/auth/login", request.url))
  }

  if (request.nextUrl.pathname.startsWith("/chat") && !userCookieValue) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/chat/:path*"],
}
