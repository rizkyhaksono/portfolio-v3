"use server";

import { getAuthorizationHeader } from "@/app/actions/actions";

const getAIChat = async (): Promise<any> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v3/ai`, {
    method: "GET",
    credentials: "include",
    headers: await getAuthorizationHeader(),
    cache: "no-store",
    signal: AbortSignal.timeout(4000),
  });
  const json = await response.json().catch(() => null);
  return { ...json, status: response.status };
};

const renameAIChat = async (id: string, title: string): Promise<void> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v3/ai/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: await getAuthorizationHeader(),
    body: JSON.stringify({ title }),
    cache: "no-store",
  });
  if (!response.ok) {
    const json = await response.json().catch(() => null);
    throw new Error(json?.message || `Failed to rename chat (${response.status})`);
  }
};

const deleteAIChat = async (id: string): Promise<void> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v3/ai/${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: await getAuthorizationHeader(),
    cache: "no-store",
  });
  if (!response.ok) {
    const json = await response.json().catch(() => null);
    throw new Error(json?.message || `Failed to delete chat (${response.status})`);
  }
};

export { getAIChat, renameAIChat, deleteAIChat };
