import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  // The OAuth callback is handled by the backend API
  // This page just exists to handle the redirect after OAuth
  // In a real implementation, you would:
  // 1. Validate the state parameter
  // 2. Exchange the code for a token (done by backend)
  // 3. Store the session/token
  // 4. Redirect to the dashboard

  // For now, just redirect to dashboard
  // The backend should have set the session cookie
  return NextResponse.redirect(new URL("/admin/dashboard", request.url));
}
