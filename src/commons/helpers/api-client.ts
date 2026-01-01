/**
 * API Client Utilities
 * Reusable functions for making API requests with proper error handling
 */

import { getAuthorizationHeader, getClientAuthorizationHeader } from "@/commons/helpers/auth-header";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

export interface ApiError extends Error {
  status?: number;
  data?: any;
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error: ApiError = new Error(
        errorData.message || `API Error: ${response.status} ${response.statusText}`
      );
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
}

/**
 * GET request helper
 */
export async function apiGet<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = await getAuthorizationHeader();
  return fetchAPI<T>(`${API_URL}${endpoint}`, {
    method: "GET",
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
}

/**
 * POST request helper
 */
export async function apiPost<T>(
  endpoint: string,
  data?: any,
  options: RequestInit = {}
): Promise<T> {
  const headers = await getAuthorizationHeader();
  return fetchAPI<T>(`${API_URL}${endpoint}`, {
    method: "POST",
    body: data ? JSON.stringify(data) : undefined,
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
}

/**
 * PATCH request helper
 */
export async function apiPatch<T>(
  endpoint: string,
  data?: any,
  options: RequestInit = {}
): Promise<T> {
  const headers = await getAuthorizationHeader();
  return fetchAPI<T>(`${API_URL}${endpoint}`, {
    method: "PATCH",
    body: data ? JSON.stringify(data) : undefined,
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
}

/**
 * DELETE request helper
 */
export async function apiDelete<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = await getAuthorizationHeader();
  return fetchAPI<T>(`${API_URL}${endpoint}`, {
    method: "DELETE",
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
}

/**
 * Upload file helper (uses FormData)
 */
export async function apiUploadFile<T>(
  endpoint: string,
  file: File,
  fieldName: string = "file"
): Promise<T> {
  const formData = new FormData();
  formData.append(fieldName, file);

  const headers = getClientAuthorizationHeader();
  delete (headers as any)["Content-Type"]; // Let browser set Content-Type

  return fetchAPI<T>(`${API_URL}${endpoint}`, {
    method: "POST",
    body: formData,
    headers,
  });
}

/**
 * Build URL with query parameters
 */
export function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  if (!params) return `${API_URL}${endpoint}`;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  const baseUrl = API_URL + endpoint;
  return queryString ? baseUrl + "?" + queryString : baseUrl;
}

/**
 * Handle API errors consistently
 */
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    const apiError = error as ApiError;
    return apiError.data?.message || apiError.message;
  }
  return "An unexpected error occurred";
}
