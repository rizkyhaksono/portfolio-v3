import type {
  JLPTLevelsResponse,
  JLPTVocabularyResponse,
  JLPTQuizResponse,
  JLPTVerifyRequest,
  JLPTVerifyResponse,
  JLPTRandomWordResponse,
} from "@/commons/types/tools";

export async function getJLPTLevels(): Promise<JLPTLevelsResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v3/japanese-quiz/levels`, {
    method: "GET",
    cache: "force-cache",
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  if (!response.ok) throw new Error("Failed to fetch JLPT levels");
  return await response.json();
}

export async function getJLPTVoca(level: string, limit = 100): Promise<JLPTVocabularyResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v3/japanese-quiz/vocabulary?level=${level}&limit=${limit}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
  if (!response.ok) throw new Error("Failed to fetch JLPT vocabulary");
  return await response.json();
}

export async function getJLPTQuiz(level: string, count = 100): Promise<JLPTQuizResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v3/japanese-quiz/quiz?level=${level}&count=${count}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
  if (!response.ok) throw new Error("Failed to fetch JLPT quiz");
  return await response.json();
}

export async function getJLPTQuizVerify(answer: JLPTVerifyRequest): Promise<JLPTVerifyResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v3/japanese-quiz/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(answer),
  });
  if (!response.ok) throw new Error("Failed to verify JLPT quiz answer");
  return await response.json();
}

export async function getJLPTRandomWord(level: string): Promise<JLPTRandomWordResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/v3/japanese-quiz/random?level=${level}`, {
    method: "GET",
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Failed to fetch JLPT random word");
  return await response.json();
}