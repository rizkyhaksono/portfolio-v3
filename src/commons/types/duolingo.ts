export interface DuolingoCourse {
  language: string;
  level: number;
  xp: number;
  skills: number;
  wordsLearned: number;
  progress: number;
}

export interface DuolingoProfile {
  username: string;
  name: string;
  streak: number;
  totalXp: number;
  lingots: number;
  gems: number;
  courses: DuolingoCourse[];
}

export interface DuolingoApiResponse {
  success: boolean;
  data: DuolingoProfile;
}
