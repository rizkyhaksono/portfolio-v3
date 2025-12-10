// API-based auth service for admin manual login/signup
// Note: This is separate from the Supabase auth in auth.ts

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  status: number;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role?: string;
  };
}

/**
 * Login with email and password via API
 */
export async function apiAuthLogin(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/v3/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  return await response.json();
}

/**
 * Sign up a new user via API
 */
export async function apiAuthSignup(credentials: SignupCredentials): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/v3/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Signup failed");
  }

  return await response.json();
}

/**
 * Logout the current user via API
 */
export async function apiAuthLogout(): Promise<void> {
  const response = await fetch(`${API_URL}/v3/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Logout failed");
  }
}

/**
 * Initiate OAuth login
 */
export function initiateOAuthLogin(provider: 'google' | 'github' | 'discord' | 'facebook'): void {
  window.location.href = `${API_URL}/v3/auth/${provider}`;
}
