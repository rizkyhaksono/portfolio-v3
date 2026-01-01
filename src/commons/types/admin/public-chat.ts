// Public Chat Types

export interface PublicChatUser {
  id: string;
  name: string;
  avatarUrl: string | null;
  headline: string | null;
}

export interface PublicChatReply {
  id: string;
  message: string;
  userId: string;
  user: PublicChatUser;
  createdAt: Date | string;
}

export interface PublicChatMessage {
  id: string;
  message: string;
  userId: string;
  user: PublicChatUser;
  replyToId?: string | null;
  replyTo?: PublicChatReply | null;
  replyCount?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PublicChatPostRequest {
  message: string;
  replyToId?: string;
}

export interface PublicChatUpdateRequest {
  message: string;
}

export interface PublicChatResponse {
  status: number;
  data: PublicChatMessage;
}

export interface PublicChatListResponse {
  status: number;
  data: PublicChatMessage[];
  nextCursor?: string;
  hasMore: boolean;
}
