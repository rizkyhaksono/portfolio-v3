"use server";

import { AIResponse } from "@/commons/types/ai";
import { getAuthorizationHeader } from "@/app/actions/actions";

const getAIChat = async (): Promise<any> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v3/ai`, {
    method: "GET",
    credentials: "include",
    headers: await getAuthorizationHeader(),
    cache: "no-store",
  });
  return await response.json();
};

const getAIChatById = async (id: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v3/ai/${id}`, {
    method: "GET",
    credentials: "include",
    headers: await getAuthorizationHeader(),
    cache: "no-store",
  });
  return await response.json();
};

const requestAIChat = async (
  prompt: string,
  chatId?: string
): Promise<AIResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v3/ai`, {
    method: "POST",
    headers: await getAuthorizationHeader(),
    body: JSON.stringify({
      text: prompt,
      ...(chatId ? { chatId } : {}),
    }),
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    // The backend only returns JSON for errors (auth, rate limit, model/key failure).
    const json = await response.json();
    if (!response.ok || (typeof json?.status === "number" && json.status >= 400)) {
      throw new Error(json?.message || `AI request failed (${response.status})`);
    }
    return json;
  }

  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || `AI request failed (${response.status})`);
  }
  const chatIdMatch = text.match(/<!--chatId:([^>]+)-->/);
  const cleanText = text.replace(/<!--chatId:[^>]+-->/, "").trim();

  return {
    status: response.status,
    data: cleanText,
    chatId: chatIdMatch?.[1],
  };
};

const renameAIChat = async (id: string, title: string): Promise<void> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v3/ai/${id}`, {
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
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v3/ai/${id}`, {
    method: "DELETE",
    headers: await getAuthorizationHeader(),
    cache: "no-store",
  });
  if (!response.ok) {
    const json = await response.json().catch(() => null);
    throw new Error(json?.message || `Failed to delete chat (${response.status})`);
  }
};

export { getAIChat, getAIChatById, requestAIChat, renameAIChat, deleteAIChat };
