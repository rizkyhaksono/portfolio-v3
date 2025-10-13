import { getPing } from "@/services/visitor/ping";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await getPing();
  return NextResponse.json(data);
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
