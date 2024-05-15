import { createClient } from "@supabase/supabase-js"

export const supabaseServer = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "", {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
    detectSessionInUrl: false,
  },
})

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wcXBlZXRvY3VnaWJycnNuc3lwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNTE4Nzg5NiwiZXhwIjoyMDMwNzYzODk2fQ.txmONMVBPrwwIn3rUgg--nfTE5WXBhCAX3N-XpeTHY0",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)
