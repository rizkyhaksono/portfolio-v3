import { supabaseUser } from "@/supabase/server";

type loginAdminType = {
  email: string;
  password: string;
}

export async function loginAdmin({
  email,
  password
}: loginAdminType) {

  const { data, error } = await supabaseUser
    .auth
    .signInWithPassword({
      email: email,
      password: password,
    })

  if (error) {
    throw error
  }

  if (data?.user?.role !== "admin") {
    throw new Error("Invalid admin account")
  } else {
    return data
  }
}