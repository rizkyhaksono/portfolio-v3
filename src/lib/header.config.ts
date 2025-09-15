import { cookies } from "next/headers";

const authHeaders = async (form = false) => {
  const token = (await cookies()).get("NATEE_V3_TOKEN")?.value;
  return {
    "Content-Type": form ? "multipart/form-data" : "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
  }
};

export {
  authHeaders,
}