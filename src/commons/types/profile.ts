import { AIChat } from "./ai";

export type OAuthAccount = {
  provider: string;
  providerAccountId: string;
  userId: string;
}

export type ProfileData = {
  id: string;
  email: string;
  emailVerified: boolean;
  isAdmin?: boolean;
  name: string;
  headline: string | null;
  location: string | null;
  about: string | null;
  iconUrl: string | null;
  avatarMinioKey: string | null;
  avatarUrl: string | null;
  bannerMinioKey: string | null;
  bannerUrl: string | null;
  role: string;
  oauthAccounts?: OAuthAccount[];
  createdAt: string;
  updatedAt: string;
  aiChat?: AIChat[];
}

export type ProfileResponse = {
  status: number;
  data: ProfileData;
}