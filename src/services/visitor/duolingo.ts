import { DuolingoApiResponse } from "@/commons/types/duolingo";

export async function getDuolingoProfile(): Promise<DuolingoApiResponse> {
  const response = await fetch(`${process.env.API_URL}/v3/duolingo/profile?username=rizkyhaksono`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch Duolingo profile");
  return await response.json();
}