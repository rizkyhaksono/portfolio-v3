import { NextResponse } from "next/server"
import { requireAdmin, getServiceClient, isAllowedTable } from "@/lib/admin-supabase-api"

export const dynamic = "force-dynamic"

type RouteParams = { params: Promise<{ table: string; id: string }> }

async function guard(table: string): Promise<NextResponse | null> {
  if (!isAllowedTable(table)) {
    return NextResponse.json({ error: `Unknown table: ${table}` }, { status: 400 })
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

  try {
    const body = await request.json()
    const { data, error } = await getServiceClient()
      .from(table)
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    if (!data?.length) {
      return NextResponse.json({ error: "Row not found — nothing was updated" }, { status: 404 })
    }
    return NextResponse.json({ data: data[0] })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Update failed" }, { status: 500 })
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
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    if (!data?.length) {
      return NextResponse.json({ error: "Row not found — nothing was deleted" }, { status: 404 })
    }
    return NextResponse.json({ data: data[0] })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Delete failed" }, { status: 500 })
  }
}
