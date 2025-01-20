import { cookies } from "next/headers";

const authHeaders = async (form = false) => {
  return {
    "Content-Type": form ? "multipart/form-data" : "application/json",
    "Authorization": `Bearer ${(await cookies()).get("auth_session")}`,
  }
};

export {
  authHeaders,
}