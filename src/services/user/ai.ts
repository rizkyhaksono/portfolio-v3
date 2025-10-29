"use server";

import { AIResponse } from "@/commons/types/ai";
import { getAuthorizationHeader, revalidateByTag } from "@/app/actions/actions";
import { fetchFromAPIWithoutThrow } from "@/lib/fetch-utils";

const getAIChat = async (): Promise<any> => {
  const response = await fetchFromAPIWithoutThrow("/ai", {
    method: "GET",
    credentials: "include",
    headers: await getAuthorizationHeader(),
    next: {
      tags: ["ai"],
      revalidate: 0,
    }
  });
  revalidateByTag("ai");
  return response;
}

const requestAIChat = async (prompt: string): Promise<AIResponse> => {
  const response = await fetchFromAPIWithoutThrow<AIResponse>("/ai", {
    method: "POST",
    headers: await getAuthorizationHeader(),
    body: JSON.stringify({
      text: prompt,
    }),
    next: {
      tags: ["ai"],
    },
  });
  revalidateByTag("ai");
  return response;
};

export {
  getAIChat,
  requestAIChat,
}