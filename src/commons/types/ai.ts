export type AIResponse = {
  status: number;
  data: string;
  chatId?: string;
}

export type AIChat = {
  id: string;
  userId: string;
  chatTitle: string;
  createdAt: string;
};