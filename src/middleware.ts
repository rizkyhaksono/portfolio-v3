import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest, response: NextResponse) {
  const cookieValue = request.cookies.get("SUPABASE_AUTH_COOKIE")

  if (cookieValue) {
    return NextResponse.next()
  } else {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }
}

export const config = {
  matcher: ["/admin/:path*", "/chat/:path*"],
}
