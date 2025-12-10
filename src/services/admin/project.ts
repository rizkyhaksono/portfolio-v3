import type {
  ProjectModel,
  ProjectListResponse,
  ProjectResponse,
  DeleteResponse,
  PaginationQuery,
} from "@/commons/types/admin";
import { getAuthorizationHeader } from "@/commons/helpers/auth-header";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

/**
 * Create a new project
 */
export async function createProject(data: Omit<ProjectModel, 'id' | 'created_at' | 'updated_at'>): Promise<ProjectResponse> {
  const response = await fetch(`${API_URL}/v3/project/`, {
    method: "POST",
    headers: await getAuthorizationHeader(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create project: ${response.status}`);
  }

  return await response.json();
}

/**
 * Get all projects with pagination
 */
export async function getAllProjects(query?: PaginationQuery): Promise<ProjectListResponse> {
  const params = new URLSearchParams();
  if (query?.page) params.append('page', query.page.toString());
  if (query?.limit) params.append('limit', query.limit.toString());

  const url = `${API_URL}/v3/project/${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url, {
    method: "GET",
    headers: await getAuthorizationHeader(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.status}`);
  }

  return await response.json();
}

/**
 * Get a single project by ID
 */
export async function getProjectById(id: string): Promise<ProjectResponse> {
  const response = await fetch(`${API_URL}/v3/project/${id}`, {
    method: "GET",
    headers: await getAuthorizationHeader(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch project: ${response.status}`);
  }

  return await response.json();
}

/**
 * Update an existing project
 */
export async function updateProject(id: string, data: Partial<ProjectModel>): Promise<ProjectResponse> {
  const response = await fetch(`${API_URL}/v3/project/${id}`, {
    method: "PATCH",
    headers: await getAuthorizationHeader(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update project: ${response.status}`);
  }

  return await response.json();
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<DeleteResponse> {
  const response = await fetch(`${API_URL}/v3/project/${id}`, {
    method: "DELETE",
    headers: await getAuthorizationHeader(),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete project: ${response.status}`);
  }

  return await response.json();
}
