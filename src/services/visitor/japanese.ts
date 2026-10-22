import type { JLPTLevelsResponse, JLPTVocabularyResponse, JLPTQuizResponse } from "@/commons/types/tools";

export async function getJLPTLevels(): Promise<JLPTLevelsResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v3/japanese-quiz/levels`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch JLPT levels");
  return await response.json();
}

export async function getJLPTVoca(level: string, limit = 100): Promise<JLPTVocabularyResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v3/japanese-quiz/vocabulary?level=${level}&limit=${limit}`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch JLPT vocabulary");
  return await response.json();
}

export async function getJLPTQuiz(level: string, count = 100): Promise<JLPTQuizResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v3/japanese-quiz/quiz?level=${level}&count=${count}`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch JLPT quiz");
  return await response.json();
}