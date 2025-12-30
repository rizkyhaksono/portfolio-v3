export interface MonkeyTypeStats {
  startedTests: number;
  completedTests: number;
  timeTyping: number;
}

export interface MonkeyTypePersonalBest {
  acc: number;
  consistency: number;
  difficulty: string;
  lazyMode: boolean;
  language: string;
  punctuation: boolean;
  raw: number;
  wpm: number;
  timestamp: number;
}

export interface MonkeyTypePersonalBests {
  time: {
    [key: string]: MonkeyTypePersonalBest[];
  };
  words: {
    [key: string]: MonkeyTypePersonalBest[];
  };
}

export interface MonkeyTypeUserData {
  stats: MonkeyTypeStats | null;
  personalBests: MonkeyTypePersonalBests | null;
  bestWpm: number;
  bestAccuracy: number;
  averageWpm: number;
}

export const EMPTY_MONKEYTYPE: MonkeyTypeUserData = {
  stats: null,
  personalBests: null,
  bestWpm: 0,
  bestAccuracy: 0,
  averageWpm: 0,
};
