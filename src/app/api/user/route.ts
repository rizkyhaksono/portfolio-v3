import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("NATEE_V3_TOKEN")?.value;

  if (!token) {
    return NextResponse.json({ user: null });
  }

  try {
    const response = await fetch(`${API_URL}/v3/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json({ user: null });
    }

    const result = await response.json();
    return NextResponse.json({
      user: {
        id: result.data?.id || result.id,
        name: result.data?.name || result.name,
      }
    });
  } catch {
    return NextResponse.json({ user: null });
  }
}
