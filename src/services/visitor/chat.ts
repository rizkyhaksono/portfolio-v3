import { PublicChatMessage } from "@/commons/types/public-chat";
import { serverApiUrl } from "@/lib/api-base";
import { getSessionToken } from "@/lib/session";

const chatUrl = () => `${serverApiUrl()}/v3/public-chat/public-chat`;

// Public chat is always fresh — never cache these reads.
const NO_STORE = { cache: "no-store" } as const;

/** Null when the API did not answer, which the page shows differently from an empty room. */
export async function getInitialMessages(): Promise<PublicChatMessage[] | null> {
  try {
    const response = await fetch(`${chatUrl()}?page=1&limit=50`, NO_STORE);
    if (!response.ok) return null;
    const result = await response.json();
    const messages: PublicChatMessage[] = result.data || [];

    return await Promise.all(
      messages.map(async (message) => {
        const hasReplies = (message.replyCount && message.replyCount > 0) || (message._count?.replies && message._count.replies > 0);
        if (!hasReplies) return { ...message, replies: [] };
        try {
          const repliesResponse = await fetch(`${chatUrl()}/${encodeURIComponent(message.id)}/replies?page=1&limit=50`, NO_STORE);
          if (repliesResponse.ok) {
            const repliesResult = await repliesResponse.json();
            return { ...message, replies: repliesResult.data || [] };
          }
        } catch {
          // A thread whose replies fail still shows its first letter.
        }
        return { ...message, replies: [] };
      })
    );
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<{ id: string; name: string } | null> {
  const token = await getSessionToken();
  if (!token) return null;

  try {
    const response = await fetch(`${serverApiUrl()}/v3/me`, {
      headers: { Authorization: `Bearer ${token}` },
      ...NO_STORE,
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
