import type {
  PublicChatPostRequest,
  PublicChatUpdateRequest,
  PublicChatResponse,
  PublicChatListResponse,
  DeleteResponse,
} from "@/commons/types/admin";
import { getAuthorizationHeader } from "@/commons/helpers/auth-header";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

/**
 * Post a new public chat message
 * Users can post once per day (top-level messages only)
 * Replies are unlimited
 */
export async function postPublicChatMessage(
  data: PublicChatPostRequest
): Promise<PublicChatResponse> {
  const response = await fetch(`${API_URL}/v3/public-chat/public-chat/`, {
    method: "POST",
    headers: await getAuthorizationHeader(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to post message: ${response.status}`);
  }

  return await response.json();
}

/**
 * Get all public chat messages with pagination
 */
export async function getAllPublicChatMessages(
  cursor?: string,
  limit: number = 10
): Promise<PublicChatListResponse> {
  const params = new URLSearchParams();
  if (cursor) params.append("cursor", cursor);
  if (limit) params.append("limit", limit.toString());

  const url = `${API_URL}/v3/public-chat/public-chat/${
    params.toString() ? `?${params.toString()}` : ""
  }`;
  
  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch messages: ${response.status}`);
  }

  return await response.json();
}

/**
 * Get replies for a specific message
 */
export async function getMessageReplies(
  messageId: string,
  cursor?: string,
  limit: number = 10
): Promise<PublicChatListResponse> {
  const params = new URLSearchParams();
  if (cursor) params.append("cursor", cursor);
  if (limit) params.append("limit", limit.toString());

  const url = `${API_URL}/v3/public-chat/public-chat/${messageId}/replies${
    params.toString() ? `?${params.toString()}` : ""
  }`;
  
  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch replies: ${response.status}`);
  }

  return await response.json();
}

/**
 * Update a public chat message
 * Users can only edit their own messages
 */
export async function updatePublicChatMessage(
  id: string,
  data: PublicChatUpdateRequest
): Promise<PublicChatResponse> {
  const response = await fetch(`${API_URL}/v3/public-chat/public-chat/${id}`, {
    method: "PATCH",
    headers: await getAuthorizationHeader(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update message: ${response.status}`);
  }

  return await response.json();
}

/**
 * Delete a public chat message
 * Users can delete their own messages
 * Admins can delete any message
 */
export async function deletePublicChatMessage(id: string): Promise<DeleteResponse> {
  const response = await fetch(`${API_URL}/v3/public-chat/public-chat/${id}`, {
    method: "DELETE",
    headers: await getAuthorizationHeader(),
  });

  if (!response.ok) {
    throw new Error(`Failed to delete message: ${response.status}`);
  }

  return await response.json();
}
