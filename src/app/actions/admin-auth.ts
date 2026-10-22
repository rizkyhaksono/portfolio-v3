"use server";

import { revalidatePath } from "next/cache";
import { authLogout } from "@/services/visitor/auth";

export async function adminLogout(): Promise<void> {
  await authLogout();
  revalidatePath("/", "layout");
}
