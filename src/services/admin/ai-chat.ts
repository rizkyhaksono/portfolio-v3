import type {
  AIChatResponse,
  AIChatListResponse,
} from "@/commons/types/admin";
import { getAuthorizationHeader } from "@/commons/helpers/auth-header";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

/**
 * Send a message to AI chat
 */
export async function sendAIMessage(text: string): Promise<AIChatResponse> {
  const response = await fetch(`${API_URL}/v3/ai/`, {
    method: "POST",
    headers: await getAuthorizationHeader(),
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send AI message: ${response.status}`);
  }

  return await response.json();
}

/**
 * Get AI chat history for current user
 */
export async function getAIChatHistory(): Promise<AIChatListResponse> {
  const response = await fetch(`${API_URL}/v3/ai/`, {
    method: "GET",
    headers: await getAuthorizationHeader(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch AI chat history: ${response.status}`);
  }

  return await response.json();
}

/**
 * Get specific AI chat by ID
 */
export async function getAIChatById(id: string): Promise<AIChatResponse> {
  const response = await fetch(`${API_URL}/v3/ai/${id}`, {
    method: "GET",
    headers: await getAuthorizationHeader(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch AI chat: ${response.status}`);
  }

  return await response.json();
}
