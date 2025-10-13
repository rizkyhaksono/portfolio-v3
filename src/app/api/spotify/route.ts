import { getNowPlaying } from "@/services/visitor/spotify";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await getNowPlaying();
  return NextResponse.json(data);
}

export const dynamic = "force-dynamic";
export const revalidate = 0;