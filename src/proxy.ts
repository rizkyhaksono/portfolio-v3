import { NextRequest, NextResponse } from "next/server"
import { isHaveValidToken } from "./app/actions/actions"

export async function proxy(request: NextRequest, _response: NextResponse) {
  const isHaveToken = await isHaveValidToken();
  const adminCookieValue = request.cookies.get("ADMIN_SUPABASE_AUTH_COOKIE")
  const nateeToken = request.cookies.get("NATEE_V3_TOKEN")

  if ((request.nextUrl.pathname.startsWith("/admin/dashboard") || request.nextUrl.pathname.startsWith("/admin/profile")) && !adminCookieValue) {
    return NextResponse.redirect(new URL("/admin/auth/login", request.url))
  }

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
