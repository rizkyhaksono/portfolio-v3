"use server";

import { serverApiUrl } from "@/lib/api-base";
import { authHeaders } from "@/lib/session";

export interface AIChatMessage {
  id: string;
  msg: string;
  role: string;
  createdAt?: string;
}

export interface AIChatSession {
  id: string;
  title: string;
  createdAt?: string;
  /** Present on summary lists; full lists and single chats carry `messages` instead. */
  messageCount?: number;
  messages?: AIChatMessage[];
}

/** Summary list (no messages) when the API supports it; older APIs ignore the flag and send messages. */
const getAIChat = async (): Promise<{ status: number; data?: AIChatSession[] }> => {
  const response = await fetch(`${serverApiUrl()}/v3/ai?summary=1`, {
    headers: await authHeaders(),
    cache: "no-store",
    signal: AbortSignal.timeout(4000),
  });
  const json = await response.json().catch(() => null);
  return { status: response.status, data: response.ok ? json?.data : undefined };
};

/** One Etan conversation, including its messages. */
const getAIChatById = async (id: string): Promise<AIChatSession | null> => {
  const response = await fetch(`${serverApiUrl()}/v3/ai/${encodeURIComponent(id)}`, {
    headers: await authHeaders(),
    cache: "no-store",
    signal: AbortSignal.timeout(6000),
  }).catch(() => null);
  if (!response?.ok) return null;
  const json = await response.json().catch(() => null);
  return json?.status >= 400 ? null : ((json?.data ?? null) as AIChatSession | null);
};

const renameAIChat = async (id: string, title: string): Promise<void> => {
  const response = await fetch(`${serverApiUrl()}/v3/ai/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: await authHeaders(),
    body: JSON.stringify({ title }),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Failed to rename chat (${response.status})`);
};

const deleteAIChat = async (id: string): Promise<void> => {
  const response = await fetch(`${serverApiUrl()}/v3/ai/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: await authHeaders(),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Failed to delete chat (${response.status})`);
};

export { getAIChat, getAIChatById, renameAIChat, deleteAIChat };
