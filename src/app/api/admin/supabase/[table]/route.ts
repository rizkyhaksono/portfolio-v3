import { NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { requireAdmin, getServiceClient, isAllowedTable, parseRow } from "@/lib/admin-supabase-api"

export const dynamic = "force-dynamic"

/** Create a row in an allowed Supabase table (admin only, service role — bypasses RLS). */
export async function POST(request: Request, { params }: { params: Promise<{ table: string }> }) {
  const { table } = await params
  if (!isAllowedTable(table)) {
    return NextResponse.json({ error: "Unknown table" }, { status: 400 })
  }

  const authError = await requireAdmin()
  if (authError) {
    return NextResponse.json({ error: authError }, { status: 401 })
  }

  const row = parseRow(table, await request.json().catch(() => null), { partial: false })
  if (!row.success) {
    return NextResponse.json({ error: "Some fields are not valid. Check them and try again." }, { status: 400 })
  }

  try {
    const { data, error } = await getServiceClient().from(table).insert(row.data).select().single()
    if (error) {
      console.error("Supabase insert failed:", error.message)
      return NextResponse.json({ error: "The row was not saved. Try again." }, { status: 400 })
    }
    revalidateTag("supabase", "max")
    return NextResponse.json({ data }, { status: 201 })
  } catch (e) {
    console.error("Supabase insert failed:", e)
    return NextResponse.json({ error: "The row was not saved. Try again." }, { status: 500 })
  }
}
