// User Types
export type UserRole = "ADMIN" | "USER";

export interface UserModel {
  id?: string;
  email: string;
  emailVerified?: boolean;
  role?: UserRole;
  name: string;
  headline?: string;
  location?: string;
  about?: string;
  avatarUrl?: string;
  avatarMinioKey?: string;
  bannerUrl?: string;
  bannerMinioKey?: string;
  iconUrl?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface UpdateUserModel {
  email?: string;
  emailVerified?: boolean;
  name?: string;
  headline?: string;
  location?: string;
  about?: string;
  bannerUrl?: string;
}

export interface UserResponse {
  status: number;
  data: UserModel;
}

export interface MeResponse {
  status: number;
  data: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    avatarUrl?: string;
    headline?: string;
  };
}
