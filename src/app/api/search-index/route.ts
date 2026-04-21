import { NextResponse } from "next/server";
import { getAllSearchDocs } from "@/lib/search-index";

export const revalidate = 3600;

export async function GET() {
  const docs = await getAllSearchDocs();
  return NextResponse.json(
    { docs },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
