import { NextRequest, NextResponse } from "next/server"
import { isHaveValidToken } from "./app/actions/actions"

export async function proxy(request: NextRequest, response: NextResponse) {
  const isHaveToken = await isHaveValidToken();
  const userCookieValue = request.cookies.get("USER_SUPABASE_AUTH_COOKIE")
  const adminCookieValue = request.cookies.get("ADMIN_SUPABASE_AUTH_COOKIE")
  const nateeToken = request.cookies.get("NATEE_V3_TOKEN")

  if ((request.nextUrl.pathname.startsWith("/admin/dashboard") || request.nextUrl.pathname.startsWith("/admin/profile")) && !adminCookieValue) {
    return NextResponse.redirect(new URL("/admin/auth/login", request.url))
  }

  // if (request.nextUrl.pathname.startsWith("/ai") && !userCookieValue) {
  //   return NextResponse.redirect(new URL("/auth", request.url))
  // }

  // Redirect authenticated users away from auth page
  if (request.nextUrl.pathname.startsWith("/auth") && nateeToken) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (request.nextUrl.pathname.startsWith("/profile") && !isHaveToken) {
    return NextResponse.redirect(new URL("/auth", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/auth/:path*",
    "/chat/:path*",
    "/profile/:path*",
  ],
}
