// AI Chat Types

export interface AIChatRequest {
  text: string;
}

export interface AIChatMessage {
  id: string;
  text: string;
  response: string;
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface AIChatResponse {
  status: number;
  data: AIChatMessage;
}

export interface AIChatListResponse {
  status: number;
  data: AIChatMessage[];
}
