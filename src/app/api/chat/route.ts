import { NextResponse } from "next/server";
import { validateChatMessage, isMalicious } from "@/lib/sanitize";
import { serverApiUrl } from "@/lib/api-base";
import { getSessionToken } from "@/lib/session";
import { apiProxyHeaders } from "@/lib/trusted-client-ip";

const CHAT_ID = /^[\w-]{1,64}$/;
/** Public chat collection on the API. */
const chatUrl = () => `${serverApiUrl()}/v3/public-chat/public-chat`;

/** The latest public chat messages. */
export async function GET() {
  try {
    const response = await fetch(chatUrl(), { cache: "no-store" });
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: response.status });
    }
    const result = await response.json();
    return NextResponse.json({ data: result.data || [] });
  } catch {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 502 });
  }
}

/** Posts a message, or a reply when `replyToId` is set. */
export async function POST(request: Request) {
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: "You must be logged in to send messages" }, { status: 401 });
  }

  try {
    const { message, replyToId } = await request.json();

    if (isMalicious(message)) {
      return NextResponse.json({ error: "Message rejected: potentially harmful content detected" }, { status: 400 });
    }

    const validation = validateChatMessage(message);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    if (replyToId !== undefined && replyToId !== null && !(typeof replyToId === "string" && CHAT_ID.test(replyToId))) {
      return NextResponse.json({ error: "That message cannot be replied to" }, { status: 400 });
    }

    const response = await fetch(chatUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...apiProxyHeaders(request.headers) },
      cache: "no-store",
      body: JSON.stringify({ message: validation.sanitized, replyToId: replyToId || undefined }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({ error: errorData.message || "Failed to send message" }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json({ data: result.data || result });
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
