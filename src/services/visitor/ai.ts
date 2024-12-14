import { AIResponse } from "@/commons/types/ai";

export async function getAIData(prompt: string): Promise<AIResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: prompt,
    }),
  });
  return await response.json();
};