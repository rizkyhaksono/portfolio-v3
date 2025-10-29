import { supabaseUser } from "@/supabase/server";

/**
 * Generic function to fetch all records from a Supabase table
 */
export async function getAllFromTable<T>(
  tableName: string,
  orderBy: string = "created_at",
  ascending: boolean = true
): Promise<T[]> {
  const { data } = await supabaseUser
    .from(tableName)
    .select("*")
    .order(orderBy, { ascending });

  return data as T[];
}

/**
 * Generic function to fetch a single record by ID from a Supabase table
 */
export async function getByIdFromTable<T>(
  tableName: string,
  id: string
): Promise<T> {
  const { data } = await supabaseUser
    .from(tableName)
    .select("*")
    .eq("id", id)
    .single();

  return data as T;
}
