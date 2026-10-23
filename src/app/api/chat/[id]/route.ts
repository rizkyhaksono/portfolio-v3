import { NextResponse } from "next/server";
import { validateChatMessage, isMalicious } from "@/lib/sanitize";
import { serverApiUrl } from "@/lib/api-base";
import { getSessionToken } from "@/lib/session";
import { apiProxyHeaders } from "@/lib/trusted-client-ip";

const CHAT_ID = /^[\w-]{1,64}$/;

interface RouteParams {
  params: Promise<{ id: string }>;
}

/** The id goes into the API path, so anything but a plain id is refused before a request is built. */
async function postUrl({ params }: RouteParams): Promise<string | null> {
  const { id } = await params;
  return CHAT_ID.test(id) ? `${serverApiUrl()}/v3/public-chat/public-chat/${encodeURIComponent(id)}` : null;
}

/** Replies under one public chat message. */
export async function GET(request: Request, context: RouteParams) {
  const url = await postUrl(context);
  if (!url) return NextResponse.json({ error: "Message not found" }, { status: 404 });

  try {
    const response = await fetch(`${url}/replies`, { cache: "no-store" });
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch replies" }, { status: response.status });
    }
    const result = await response.json();
    return NextResponse.json({ data: result.data || [] });
  } catch {
    return NextResponse.json({ error: "Failed to fetch replies" }, { status: 502 });
  }
}

/** Replaces the text of one of your messages. */
export async function PATCH(request: Request, context: RouteParams) {
  const url = await postUrl(context);
  if (!url) return NextResponse.json({ error: "Message not found" }, { status: 404 });
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: "You must be logged in to edit messages" }, { status: 401 });
  }

  try {
    const { message } = await request.json();

    if (isMalicious(message)) {
      return NextResponse.json({ error: "Message rejected: potentially harmful content detected" }, { status: 400 });
    }

    const validation = validateChatMessage(message);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const response = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...apiProxyHeaders(request.headers) },
      cache: "no-store",
      body: JSON.stringify({ message: validation.sanitized }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({ error: errorData.message || "Failed to update message" }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json({ data: result.data || result });
  } catch {
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}

/** Removes one of your messages. */
export async function DELETE(request: Request, context: RouteParams) {
  const url = await postUrl(context);
  if (!url) return NextResponse.json({ error: "Message not found" }, { status: 404 });
  const token = await getSessionToken();
  if (!token) {
    return NextResponse.json({ error: "You must be logged in to delete messages" }, { status: 401 });
  }

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}`, ...apiProxyHeaders(request.headers) },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({ error: errorData.message || "Failed to delete message" }, { status: response.status });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
