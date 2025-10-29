import { DuolingoApiResponse } from "@/commons/types/duolingo";

export async function getDuolingoProfile(): Promise<DuolingoApiResponse> {
  const response = await fetch(`https://api.nateee.com/v3/duolingo/profile?username=rizkyhaksono`,
    {
      method: "GET",
      next: { revalidate: 3600 }, // Cache for 1 hour
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch Duolingo profile");
  }

  return await response.json();
}