import { getWeather } from "@/services/visitor/weather";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await getWeather();
  return NextResponse.json(data);
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
