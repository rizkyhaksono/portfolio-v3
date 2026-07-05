import { createClient } from "@supabase/supabase-js"

// Read-only client (anon key, RLS-scoped). Admin WRITES must go through
// /api/admin/supabase/* which uses the service-role key server-side — an
// "admin" client here would silently fall back to anon in the browser.
export const supabaseUser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "", {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
})
