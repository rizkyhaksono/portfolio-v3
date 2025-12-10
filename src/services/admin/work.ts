import type {
  WorkModel,
  WorkListResponse,
  WorkResponse,
  DeleteResponse,
  PaginationQuery,
} from "@/commons/types/admin";
import { getAuthorizationHeader } from "@/commons/helpers/auth-header";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

/**
 * Create a new work experience entry
 */
export async function createWork(data: Omit<WorkModel, 'id' | 'created_at' | 'updated_at'>): Promise<WorkResponse> {
  const response = await fetch(`${API_URL}/v3/work/`, {
    method: "POST",
    headers: await getAuthorizationHeader(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create work: ${response.status}`);
  }

  return await response.json();
}

/**
 * Get all work experiences with pagination
 */
export async function getAllWork(query?: PaginationQuery): Promise<WorkListResponse> {
  const params = new URLSearchParams();
  if (query?.page) params.append('page', query.page.toString());
  if (query?.limit) params.append('limit', query.limit.toString());

  const url = `${API_URL}/v3/work/${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url, {
    method: "GET",
    headers: await getAuthorizationHeader(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch work experiences: ${response.status}`);
  }

  return await response.json();
}

/**
 * Get a single work experience by ID
 */
export async function getWorkById(id: string): Promise<WorkResponse> {
  const response = await fetch(`${API_URL}/v3/work/${id}`, {
    method: "GET",
    headers: await getAuthorizationHeader(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch work: ${response.status}`);
  }

  return await response.json();
}

/**
 * Update an existing work experience
 */
export async function updateWork(id: string, data: Partial<WorkModel>): Promise<WorkResponse> {
  const response = await fetch(`${API_URL}/v3/work/${id}`, {
    method: "PATCH",
    headers: await getAuthorizationHeader(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update work: ${response.status}`);
  }

  return await response.json();
}

/**
 * Delete a work experience
 */
export async function deleteWork(id: string): Promise<DeleteResponse> {
  const response = await fetch(`${API_URL}/v3/work/${id}`, {
    method: "DELETE",
    headers: await getAuthorizationHeader(),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete work: ${response.status}`);
  }

  return await response.json();
}
