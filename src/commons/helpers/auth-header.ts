// Auth header helper for admin API calls

export async function getAuthorizationHeader(): Promise<HeadersInit> {
  // For now, using NEXT_PUBLIC_API_URL approach
  // In production, you would retrieve the auth token from cookies/session
  // and add it to the Authorization header

  // Example implementation:
  // const token = getCookie('auth_token');
  // return {
  //   'Content-Type': 'application/json',
  //   'Authorization': `Bearer ${token}`
  // };

  return {
    'Content-Type': 'application/json',
  };
}
