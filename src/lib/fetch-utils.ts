/**
 * Generic fetch utility for API calls with consistent error handling
 */
export async function fetchAPI<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch: ${url}`);
  }
  
  return await response.json();
}

/**
 * Fetch blob data (for images, files, etc.)
 */
export async function fetchBlob(
  url: string,
  options?: RequestInit
): Promise<Blob> {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch blob: ${url}`);
  }
  
  return await response.blob();
}

/**
 * Fetch from API with specific path and base URL from environment
 */
export async function fetchFromAPI<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
  return fetchAPI<T>(`${baseUrl}${path}`, options);
}

/**
 * Fetch from API with JSON response
 * Note: May throw if response body is not valid JSON
 */
export async function fetchFromAPIAsJSON<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
  const response = await fetch(`${baseUrl}${path}`, options);
  return await response.json();
}

