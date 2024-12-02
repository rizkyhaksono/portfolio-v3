import { AIResponse } from "@/commons/types/ai.type";

export async function getAIData(prompt: string): Promise<AIResponse> {
  const response = await fetch(`${process.env.API_URL}/ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: prompt,
    }),
  });
  if (response.status !== 200) return {} as AIResponse;
  return await response.json();
};