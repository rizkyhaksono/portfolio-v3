"use server";

import { AIResponse } from "@/commons/types/ai";
import { getAuthorizationHeader, revalidateByTag } from "@/app/actions";

const getAIChat = async (): Promise<any> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai`, {
    method: "GET",
    credentials: "include",
    headers: await getAuthorizationHeader(),
    next: {
      tags: ["ai"],
      revalidate: 0,
    }
  });
  return await response.json();
}

const requestAIChat = async (prompt: string): Promise<AIResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: prompt,
    }),
    next: {
      tags: ["ai"],
    },
  });
  revalidateByTag("ai");
  return await response.json();
};

export {
  getAIChat,
  requestAIChat,
}