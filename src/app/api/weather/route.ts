import { getWeather } from "@/services/visitor/weather";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const latParam = req.nextUrl.searchParams.get("lat");
  const lonParam = req.nextUrl.searchParams.get("lon");
  const lat = latParam != null ? Number(latParam) : undefined;
  const lon = lonParam != null ? Number(lonParam) : undefined;

  try {
    const data = await getWeather(lat, lon);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Weather unavailable" }, { status: 502 });
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
