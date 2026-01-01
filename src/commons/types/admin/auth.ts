// Authentication Types
import type { UserModel, UserRole } from "./user";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  status: number;
  token: string;
  user: UserModel;
  message?: string;
}

export interface OAuthProvider {
  name: string;
  provider: "google" | "github" | "discord" | "facebook";
  icon: React.ComponentType<{ className?: string }>;
  colorClass: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}
