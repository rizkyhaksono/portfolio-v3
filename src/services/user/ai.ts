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
    }
  });
  revalidateByTag("ai");
  return await response.json();
}

const requestAIChat = async (prompt: string): Promise<AIResponse> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v3/ai`, {
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
  
  // Check content type to handle both JSON and plain text responses
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return await response.json();
  }
  
  // Handle plain text response
  const text = await response.text();
  return {
    status: response.status,
    data: text,
  };
};

export {
  getAIChat,
  requestAIChat,
}