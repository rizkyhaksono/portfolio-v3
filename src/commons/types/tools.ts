// Japanese Quiz Types
export interface JLPTLevel {
  code: string;
  name: string;
  description: string;
}

export interface JLPTLevelsResponse {
  success: boolean;
  levels: JLPTLevel[];
}

export interface JLPTWord {
  word: string;
  reading: string;
  meaning: string;
  level: string;
  partOfSpeech: string;
}

export interface JLPTVocabularyResponse {
  success: boolean;
  level: string;
  count: number;
  words: JLPTWord[];
}

export interface JLPTQuestion {
  id: number;
  word: string;
  reading: string;
  options: string[];
  correct: string;
  level: string;
}

export interface JLPTQuizResponse {
  success: boolean;
  level: string;
  count: number;
  questions: JLPTQuestion[];
}

export interface JLPTVerifyRequest {
  questionId: number;
  answer: string;
  correct: string;
}

export interface JLPTVerifyResponse {
  success: boolean;
  questionId: number;
  isCorrect: boolean;
  message: string;
}

export interface JLPTRandomWordResponse {
  success: boolean;
  word: JLPTWord;
}

// Anime Types
export interface AnimeImageResponse {
  url: string;
}

// Downloader Types
export interface DownloadResult {
  title: string;
  thumbnail: string;
  downloadLinks: {
    quality: string;
    url: string;
    size?: string;
  }[];
  author?: string;
  duration?: string;
}

// Tools Tab Types
export type ToolTab =
  | "japanese-quiz"
  | "anime-generator"
  | "downloader"
  | "wpm"
  | "files"
  | "compiler";

export interface ToolCategory {
  id: ToolTab;
  name: string;
  description: string;
  icon: string;
}
