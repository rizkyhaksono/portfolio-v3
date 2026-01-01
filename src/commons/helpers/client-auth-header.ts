// Client-side auth header helper
// Can be safely imported in client components

/**
 * Get authorization headers for client-side requests
 * Retrieves token from document.cookie
 */
export function getClientAuthorizationHeader(): HeadersInit {
  if (globalThis.document === undefined || globalThis.window === undefined) {
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
      Authorization: `Bearer ${token}`,
    };
  }

  return {
    "Content-Type": "application/json",
  };
}

/**
 * Get token value from client-side cookies
 */
export function getClientToken(): string | null {
  if (globalThis.document === undefined || globalThis.window === undefined) {
    return null;
  }

  const cookies = document.cookie.split("; ");
  const tokenCookie = cookies.find((cookie) =>
    cookie.startsWith("NATEE_V3_TOKEN=")
  );

  return tokenCookie ? tokenCookie.split("=")[1] : null;
}
