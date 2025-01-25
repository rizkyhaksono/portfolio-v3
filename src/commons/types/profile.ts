import { AIChat } from "./ai";

export type ProfileData = {
  id: string;
  email: string;
  emailVerified: boolean;
  isAdmin: boolean;
  name: string;
  headline: string | null;
  location: string | null;
  about: string | null;
  bannerUrl: string | null;
  iconUrl: string | null;
  hashedPassword: string;
  passwordSalt: string;
  created_at: string;
  updated_at: string;
  aiChat: AIChat[];
}

export type ProfileResponse = {
  status: number;
  data: ProfileData;
}