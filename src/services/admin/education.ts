import type {
  EducationModel,
  EducationListResponse,
  EducationResponse,
  DeleteResponse,
  PaginationQuery,
} from "@/commons/types/admin";
import { getAuthorizationHeader } from "@/commons/helpers/auth-header";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

/**
 * Create a new education entry
 */
export async function createEducation(data: Omit<EducationModel, 'id' | 'created_at' | 'updated_at'>): Promise<EducationResponse> {
  const response = await fetch(`${API_URL}/v3/education/`, {
    method: "POST",
    headers: await getAuthorizationHeader(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create education: ${response.status}`);
  }

  return await response.json();
}

/**
 * Get all education records with pagination
 */
export async function getAllEducation(query?: PaginationQuery): Promise<EducationListResponse> {
  const params = new URLSearchParams();
  if (query?.page) params.append('page', query.page.toString());
  if (query?.limit) params.append('limit', query.limit.toString());

  const url = `${API_URL}/v3/education/${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url, {
    method: "GET",
    headers: await getAuthorizationHeader(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch education records: ${response.status}`);
  }

  return await response.json();
}

/**
 * Get a single education record by ID
 */
export async function getEducationById(id: string): Promise<EducationResponse> {
  const response = await fetch(`${API_URL}/v3/education/${id}`, {
    method: "GET",
    headers: await getAuthorizationHeader(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch education: ${response.status}`);
  }

  return await response.json();
}

/**
 * Update an existing education record
 */
export async function updateEducation(id: string, data: Partial<EducationModel>): Promise<EducationResponse> {
  const response = await fetch(`${API_URL}/v3/education/${id}`, {
    method: "PATCH",
    headers: await getAuthorizationHeader(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update education: ${response.status}`);
  }

  return await response.json();
}

/**
 * Delete an education record
 */
export async function deleteEducation(id: string): Promise<DeleteResponse> {
  const response = await fetch(`${API_URL}/v3/education/${id}`, {
    method: "DELETE",
    headers: await getAuthorizationHeader(),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete education: ${response.status}`);
  }

  return await response.json();
}
