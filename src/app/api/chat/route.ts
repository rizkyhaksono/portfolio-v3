import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { validateChatMessage, isMalicious } from "@/lib/sanitize";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  try {
    const response = await fetch(`${API_URL}/v3/public-chat/public-chat/`, {
      method: "GET",
      cache: "no-store",
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json({ data: result.data || [] });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("NATEE_V3_TOKEN")?.value;

  if (!token) {
    return NextResponse.json({ error: "You must be logged in to send messages" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { message, replyToId } = body;

    if (isMalicious(message)) {
      return NextResponse.json(
        { error: "Message rejected: potentially harmful content detected" },
        { status: 400 }
      );
    }

    const validation = validateChatMessage(message);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const response = await fetch(`${API_URL}/v3/public-chat/public-chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      next: { revalidate: 0 },
      body: JSON.stringify({
        message: validation.sanitized,
        replyToId: replyToId || undefined,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Failed to send message" },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json({ data: result.data || result });
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
