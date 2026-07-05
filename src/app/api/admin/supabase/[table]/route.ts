import { NextResponse } from "next/server"
import { requireAdmin, getServiceClient, isAllowedTable } from "@/lib/admin-supabase-api"

export const dynamic = "force-dynamic"

/** Create a row in an allowed Supabase table (admin only, service role — bypasses RLS). */
export async function POST(request: Request, { params }: { params: Promise<{ table: string }> }) {
  const { table } = await params
  if (!isAllowedTable(table)) {
    return NextResponse.json({ error: `Unknown table: ${table}` }, { status: 400 })
  }

  const authError = await requireAdmin()
  if (authError) {
    return NextResponse.json({ error: authError }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { data, error } = await getServiceClient().from(table).insert(body).select().single()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    return NextResponse.json({ data }, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Create failed" }, { status: 500 })
  }
}
