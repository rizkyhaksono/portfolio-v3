import type {
  UpdateUserModel,
  UserResponse,
  UploadFileResponse,
  DownloadFileResponse,
} from "@/commons/types/admin";
import { getAuthorizationHeader, getClientAuthorizationHeader } from "@/commons/helpers/auth-header";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

/**
 * Get current user information
 */
export async function getCurrentUser(): Promise<UserResponse> {
  const response = await fetch(`${API_URL}/v3/me/`, {
    method: "GET",
    headers: await getAuthorizationHeader(),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }

  return await response.json();
}

/**
 * Update user information
 */
export async function updateUser(
  id: string,
  data: UpdateUserModel
): Promise<UserResponse> {
  const response = await fetch(`${API_URL}/v3/me/${id}`, {
    method: "PATCH",
    headers: await getAuthorizationHeader(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update user: ${response.status}`);
  }

  return await response.json();
}

/**
 * Upload user avatar
 */
export async function uploadAvatar(file: File): Promise<UploadFileResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const headers = getClientAuthorizationHeader();
  delete (headers as any)["Content-Type"]; // Let browser set Content-Type for FormData

  const response = await fetch(`${API_URL}/v3/me/avatar`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload avatar: ${response.status}`);
  }

  return await response.json();
}

/**
 * Get user avatar URL
 */
export async function getAvatarUrl(): Promise<DownloadFileResponse> {
  const response = await fetch(`${API_URL}/v3/me/avatar`, {
    method: "GET",
    headers: await getAuthorizationHeader(),
  });

  if (!response.ok) {
    throw new Error(`Failed to get avatar: ${response.status}`);
  }

  return await response.json();
}

/**
 * Delete user avatar
 */
export async function deleteAvatar(): Promise<{ status: number; message: string }> {
  const response = await fetch(`${API_URL}/v3/me/avatar`, {
    method: "DELETE",
    headers: await getAuthorizationHeader(),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete avatar: ${response.status}`);
  }

  return await response.json();
}

/**
 * Upload user banner
 */
export async function uploadBanner(file: File): Promise<UploadFileResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const headers = getClientAuthorizationHeader();
  delete (headers as any)["Content-Type"];

  const response = await fetch(`${API_URL}/v3/me/banner`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload banner: ${response.status}`);
  }

  return await response.json();
}

/**
 * Get user banner URL
 */
export async function getBannerUrl(): Promise<DownloadFileResponse> {
  const response = await fetch(`${API_URL}/v3/me/banner`, {
    method: "GET",
    headers: await getAuthorizationHeader(),
  });

  if (!response.ok) {
    throw new Error(`Failed to get banner: ${response.status}`);
  }

  return await response.json();
}

/**
 * Delete user banner
 */
export async function deleteBanner(): Promise<{ status: number; message: string }> {
  const response = await fetch(`${API_URL}/v3/me/banner`, {
    method: "DELETE",
    headers: await getAuthorizationHeader(),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete banner: ${response.status}`);
  }

  return await response.json();
}
