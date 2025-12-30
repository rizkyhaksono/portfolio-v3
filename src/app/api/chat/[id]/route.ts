import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { validateChatMessage, isMalicious } from "@/lib/sanitize";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params;

  try {
    const response = await fetch(
      `${API_URL}/v3/public-chat/public-chat/${id}/replies`,
      {
        method: "GET",
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch replies" }, { status: response.status });
    }

    const result = await response.json();
    return NextResponse.json({ data: result.data || [] });
  } catch (error) {
    console.error("Error fetching replies:", error);
    return NextResponse.json({ error: "Failed to fetch replies" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("NATEE_V3_TOKEN")?.value;

  if (!token) {
    return NextResponse.json({ error: "You must be logged in to edit messages" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { message } = body;

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

    const response = await fetch(
      `${API_URL}/v3/public-chat/public-chat/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        next: { revalidate: 0 },
        body: JSON.stringify({ message: validation.sanitized }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Failed to update message" },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json({ data: result.data || result });
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("NATEE_V3_TOKEN")?.value;

  if (!token) {
    return NextResponse.json({ error: "You must be logged in to delete messages" }, { status: 401 });
  }

  try {
    const response = await fetch(
      `${API_URL}/v3/public-chat/public-chat/${id}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        next: { revalidate: 0 },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.message || "Failed to delete message" },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
