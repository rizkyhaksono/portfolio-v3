import { NextResponse } from "next/server"
import { revalidateTag } from "next/cache"
import { requireAdmin, getServiceClient, isAllowedTable, parseRow } from "@/lib/admin-supabase-api"

export const dynamic = "force-dynamic"

type RouteParams = { params: Promise<{ table: string; id: string }> }

async function guard(table: string): Promise<NextResponse | null> {
  if (!isAllowedTable(table)) {
    return NextResponse.json({ error: "Unknown table" }, { status: 400 })
  }
  const authError = await requireAdmin()
  if (authError) {
    return NextResponse.json({ error: authError }, { status: 401 })
  }
  return null
}

/** Update a row (admin only). Errors when the id matches nothing so the UI can't fake success. */
export async function PATCH(request: Request, { params }: RouteParams) {
  const { table, id } = await params
  const guardError = await guard(table)
  if (guardError) return guardError
  if (!isAllowedTable(table)) return NextResponse.json({ error: "Unknown table" }, { status: 400 })

  const row = parseRow(table, await request.json().catch(() => null), { partial: true })
  if (!row.success) {
    return NextResponse.json({ error: "Some fields are not valid. Check them and try again." }, { status: 400 })
  }

  try {
    const { data, error } = await getServiceClient()
      .from(table)
      .update({ ...row.data, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
    if (error) {
      console.error("Supabase update failed:", error.message)
      return NextResponse.json({ error: "The change was not saved. Try again." }, { status: 400 })
    }
    if (!data?.length) {
      return NextResponse.json({ error: "Row not found — nothing was updated" }, { status: 404 })
    }
    revalidateTag("supabase", "max")
    return NextResponse.json({ data: data[0] })
  } catch (e) {
    console.error("Supabase update failed:", e)
    return NextResponse.json({ error: "The change was not saved. Try again." }, { status: 500 })
  }
}

/** Delete a row (admin only). Errors when the id matches nothing so the UI can't fake success. */
export async function DELETE(_request: Request, { params }: RouteParams) {
  const { table, id } = await params
  const guardError = await guard(table)
  if (guardError) return guardError

  try {
    const { data, error } = await getServiceClient().from(table).delete().eq("id", id).select()
    if (error) {
      console.error("Supabase delete failed:", error.message)
      return NextResponse.json({ error: "The row was not deleted. Try again." }, { status: 400 })
    }
    if (!data?.length) {
      return NextResponse.json({ error: "Row not found — nothing was deleted" }, { status: 404 })
    }
    revalidateTag("supabase", "max")
    return NextResponse.json({ data: data[0] })
  } catch (e) {
    console.error("Supabase delete failed:", e)
    return NextResponse.json({ error: "The row was not deleted. Try again." }, { status: 500 })
  }
}
