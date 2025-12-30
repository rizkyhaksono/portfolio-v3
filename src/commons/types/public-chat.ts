export interface PublicChatUser {
  id: string;
  name: string;
  avatarUrl: string | null;
  headline?: string | null;
}

export interface PublicChatMessage {
  id: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  userId: string | null;
  user: PublicChatUser | null;
  replyToId: string | null;
  replyCount?: number;
  _count?: {
    replies: number;
  };
  replies?: PublicChatMessage[];
}

export interface PublicChatResponse {
  status: number;
  message: string;
  data: PublicChatMessage[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  prev: number | null;
  next: number | null;
}

export interface CreateMessagePayload {
  message: string;
  replyToId?: string;
}

export interface UpdateMessagePayload {
  message: string;
}
