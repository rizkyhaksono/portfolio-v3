"use server";

import { AIResponse } from "@/commons/types/ai";
import { getAuthorizationHeader, revalidateByTag } from "@/app/actions/actions";

const getAIChat = async (): Promise<any> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v3/ai`, {
    method: "GET",
    credentials: "include",
    headers: await getAuthorizationHeader(),
    next: {
      tags: ["ai"],
      revalidate: 0,
    },
  });
  revalidateByTag("ai");
  return await response.json();
};

const getAIChatById = async (id: string) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v3/ai/${id}`, {
    method: "GET",
    credentials: "include",
    headers: await getAuthorizationHeader(),
    next: { tags: ["ai", `ai-${id}`], revalidate: 0 },
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
    next: { tags: ["ai"] },
  });
  revalidateByTag("ai");

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return await response.json();
  }

  const text = await response.text();
  const chatIdMatch = text.match(/<!--chatId:([^>]+)-->/);
  const cleanText = text.replace(/<!--chatId:[^>]+-->/, "").trim();

  return {
    status: response.status,
    data: cleanText,
    chatId: chatIdMatch?.[1],
  };
};

export { getAIChat, getAIChatById, requestAIChat };
