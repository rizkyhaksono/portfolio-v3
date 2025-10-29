import type {
  JLPTLevelsResponse,
  JLPTVocabularyResponse,
  JLPTQuizResponse,
  JLPTVerifyRequest,
  JLPTVerifyResponse,
  JLPTRandomWordResponse,
} from "@/commons/types/tools";
import { fetchFromAPI } from "@/lib/fetch-utils";

export async function getJLPTLevels(): Promise<JLPTLevelsResponse> {
  return fetchFromAPI<JLPTLevelsResponse>("/v3/japanese-quiz/levels", {
    method: "GET",
    cache: "force-cache",
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
}

export async function getJLPTVoca(level: string, limit = 100): Promise<JLPTVocabularyResponse> {
  return fetchFromAPI<JLPTVocabularyResponse>(
    `/v3/japanese-quiz/vocabulary?level=${level}&limit=${limit}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
}

export async function getJLPTQuiz(level: string, count = 100): Promise<JLPTQuizResponse> {
  return fetchFromAPI<JLPTQuizResponse>(
    `/v3/japanese-quiz/quiz?level=${level}&count=${count}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
}

export async function getJLPTQuizVerify(answer: JLPTVerifyRequest): Promise<JLPTVerifyResponse> {
  return fetchFromAPI<JLPTVerifyResponse>("/v3/japanese-quiz/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(answer),
  });
}

export async function getJLPTRandomWord(level: string): Promise<JLPTRandomWordResponse> {
  return fetchFromAPI<JLPTRandomWordResponse>(
    `/v3/japanese-quiz/random?level=${level}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
}