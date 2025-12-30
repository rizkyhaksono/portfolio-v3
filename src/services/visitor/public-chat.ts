import { 
  PublicChatMessage, 
  CreateMessagePayload, 
  UpdateMessagePayload 
} from "@/commons/types/public-chat";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function getErrorMessage(errorData: any): string {
  if (typeof errorData === 'string') return errorData;
  if (typeof errorData?.message === 'string') return errorData.message;
  if (Array.isArray(errorData?.message)) return errorData.message.join(', ');
  if (typeof errorData?.error === 'string') return errorData.error;
  return 'An error occurred';
}

export async function getPublicChatMessages(): Promise<PublicChatMessage[]> {
  const response = await fetch(`${API_URL}/v3/public-chat/public-chat/`, {
    method: "GET",
    cache: "no-store",
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(getErrorMessage(errorData) || "Failed to fetch public chat messages");
  }
  
  const data = await response.json();
  return data.data || data;
}

export async function getMessageReplies(messageId: string): Promise<PublicChatMessage[]> {
  const response = await fetch(`${API_URL}/v3/public-chat/public-chat/${messageId}/replies`, {
    method: "GET",
    cache: "no-store",
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(getErrorMessage(errorData) || "Failed to fetch message replies");
  }
  
  const data = await response.json();
  return data.data || data;
}

export async function createMessage(
  payload: CreateMessagePayload,
  accessToken: string
): Promise<PublicChatMessage> {
  const response = await fetch(`${API_URL}/v3/public-chat/public-chat/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(getErrorMessage(errorData) || "Failed to create message");
  }
  
  const data = await response.json();
  return data.data || data;
}

export async function updateMessage(
  messageId: string,
  payload: UpdateMessagePayload,
  accessToken: string
): Promise<PublicChatMessage> {
  const response = await fetch(`${API_URL}/v3/public-chat/public-chat/${messageId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(getErrorMessage(errorData) || "Failed to update message");
  }
  
  const data = await response.json();
  return data.data || data;
}

export async function deleteMessage(
  messageId: string,
  accessToken: string
): Promise<void> {
  const response = await fetch(`${API_URL}/v3/public-chat/public-chat/${messageId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(getErrorMessage(errorData) || "Failed to delete message");
  }
}
