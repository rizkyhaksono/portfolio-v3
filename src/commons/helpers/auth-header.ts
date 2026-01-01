// Auth header helper for admin API calls
import { cookies } from "next/headers";

/**
 * Get authorization headers with bearer token from cookies
 * Supports both server and client components
 */
export async function getAuthorizationHeader(): Promise<HeadersInit> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("NATEE_V3_TOKEN")?.value;

    if (token) {
      return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      };
    }
  } catch (error) {
    // Handle cases where cookies() is not available (client-side)
    console.warn("Failed to retrieve auth token:", error);
  }

  return {
    "Content-Type": "application/json",
  };
}

/**
 * Get authorization headers for client-side requests
 * Retrieves token from document.cookie
 */
export function getClientAuthorizationHeader(): HeadersInit {
  if (typeof document === "undefined") {
    return { "Content-Type": "application/json" };
  }

  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((cookie) =>
    cookie.startsWith("NATEE_V3_TOKEN=")
  );

  if (tokenCookie) {
    const token = tokenCookie.split("=")[1];
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };
  }

  return {
    "Content-Type": "application/json",
  };
}
