import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { z } from "zod"
import { serverApiUrl } from "@/lib/api-base"
import { getSessionToken } from "@/lib/session"

/**
 * Server-side helpers for the /api/admin/supabase routes.
 *
 * Admin mutations must NEVER run in the browser: the anon key is subject to RLS,
 * which silently matches 0 rows on UPDATE/DELETE (PostgREST returns 204) — the UI
 * then reports success while nothing changed. These helpers give route handlers a
 * service-role client (bypasses RLS) plus an auth gate so only the ADMIN user can
 * reach it.
 */

export const ALLOWED_TABLES = ["projects", "career", "education"] as const
export type AllowedTable = (typeof ALLOWED_TABLES)[number]

export function isAllowedTable(table: string): table is AllowedTable {
  return (ALLOWED_TABLES as readonly string[]).includes(table)
}

const text = (max: number) => z.string().trim().max(max)
// Stored links become hrefs and image sources on public pages, so only http(s) or site paths are kept.
const link = z
  .string()
  .trim()
  .max(2048)
  .refine((value) => value === "" || /^https?:\/\//i.test(value) || (value.startsWith("/") && !value.startsWith("//")))
  .nullable()

const ROW_SCHEMAS = {
  projects: z.object({ title: text(200), description: text(20_000), url: link, source_code: link, image: link }),
  career: z.object({ title: text(200), subtitle: text(200), duration: text(100), image: link }),
  education: z.object({ title: text(200), subtitle: text(200), duration: text(100), image: link }),
} satisfies Record<AllowedTable, z.AnyZodObject>

/** Keeps only the columns the dashboard edits; anything else in the body is dropped. */
export function parseRow(table: AllowedTable, body: unknown, { partial }: { partial: boolean }) {
  const schema: z.AnyZodObject = partial ? ROW_SCHEMAS[table].partial() : ROW_SCHEMAS[table]
  return schema.safeParse(body)
}

/** Verifies the caller is the signed-in ADMIN via the backend /v3/me. Returns an error message or null. */
export async function requireAdmin(): Promise<string | null> {
  const token = await getSessionToken()
  if (!token) return "Not authenticated"

  const apiUrl = serverApiUrl()
  if (!apiUrl) return "API_URL is not configured"

  try {
    const res = await fetch(`${apiUrl}/v3/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    if (!res.ok) return "Not authenticated"
    const json = await res.json()
    const role = json?.data?.role ?? json?.role
    return role === "ADMIN" ? null : "Admin access required"
  } catch {
    return "Failed to verify session"
  }
}

/** Service-role Supabase client. Throws when the key is missing instead of silently falling back to anon. */
export function getServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured on the server")
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
