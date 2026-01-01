import type {
  UploadFileResponse,
  DownloadFileResponse,
} from "@/commons/types/admin";
import { getClientAuthorizationHeader } from "@/commons/helpers/auth-header";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

/**
 * Upload file to MinIO storage
 */
export async function uploadFile(file: File): Promise<UploadFileResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const headers = getClientAuthorizationHeader();
  delete (headers as any)["Content-Type"]; // Let browser set Content-Type for FormData

  const response = await fetch(`${API_URL}/v3/asset/minio`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to upload file: ${response.status}`);
  }

  return await response.json();
}

/**
 * Download file from MinIO storage
 */
export async function downloadFile(
  filename: string
): Promise<DownloadFileResponse> {
  const response = await fetch(`${API_URL}/v3/asset/minio/download`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filename }),
  });

  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.status}`);
  }

  return await response.json();
}

/**
 * Get public link for file from MinIO storage
 */
export async function getPublicFileLink(
  filename: string
): Promise<DownloadFileResponse> {
  const response = await fetch(`${API_URL}/v3/asset/minio/download/public`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filename }),
  });

  if (!response.ok) {
    throw new Error(`Failed to get public link: ${response.status}`);
  }

  return await response.json();
}
