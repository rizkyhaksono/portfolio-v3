import type { AuthResponse, LoginRequest } from "@/commons/types/admin";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

/**
 * Login with email and password
 */
export async function loginWithCredentials(
  credentials: LoginRequest
): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/v3/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

/**
 * Get current user info
 */
export async function getCurrentUserWithToken(
  token: string
): Promise<{ data: { id: string; email: string; name: string; role: string; avatarUrl?: string } }> {
  const response = await fetch(`${API_URL}/v3/me/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to get user info");
  }

  return await response.json();
}

/**
 * Verify if user has admin role
 */
export async function verifyAdminRole(token: string): Promise<boolean> {
  try {
    const userData = await getCurrentUserWithToken(token);
    return userData.data?.role === "ADMIN";
  } catch {
    return false;
  }
}

/**
 * Get OAuth login URL
 */
export function getOAuthLoginUrl(provider: string): string {
  return `${API_URL}/v3/auth/${provider}`;
}

/**
 * Logout - invalidate session
 */
export async function logout(token: string): Promise<void> {
  await fetch(`${API_URL}/v3/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
  });
}
