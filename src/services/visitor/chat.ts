import { PublicChatMessage } from "@/commons/types/public-chat";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getInitialMessages(): Promise<PublicChatMessage[]> {
  try {
    const response = await fetch(`${API_URL}/v3/public-chat/public-chat/`, {
      method: "GET",
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (!response.ok) return [];
    const result = await response.json();
    const messages: PublicChatMessage[] = result.data || [];

    const messagesWithReplies = await Promise.all(
      messages.map(async (message) => {
        const hasReplies = (message.replyCount && message.replyCount > 0) || (message._count?.replies && message._count.replies > 0);

        if (hasReplies) {
          try {
            const repliesResponse = await fetch(
              `${API_URL}/v3/public-chat/public-chat/${message.id}/replies`,
              {
                method: "GET",
                cache: "no-store",
                next: { revalidate: 0 },
              }
            );
            if (repliesResponse.ok) {
              const repliesResult = await repliesResponse.json();
              return { ...message, replies: repliesResult.data || [] };
            }
          } catch {
          }
        }
        return { ...message, replies: [] };
      })
    );

    return messagesWithReplies;
  } catch {
    return [];
  }
}

export async function getCurrentUser(): Promise<{ id: string; name: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("NATEE_V3_TOKEN")?.value;

  if (!token) return null;

  try {
    const response = await fetch(`${API_URL}/v3/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
      next: { revalidate: 0 },
    });
    if (!response.ok) return null;
    const result = await response.json();
    return {
      id: result.data?.id || result.id,
      name: result.data?.name || result.name,
    };
  } catch {
    return null;
  }
}
