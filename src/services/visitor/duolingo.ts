import { DuolingoApiResponse } from "@/commons/types/duolingo";
import { fetchFromAPI } from "@/lib/fetch-utils";

export async function getDuolingoProfile(): Promise<DuolingoApiResponse> {
  return fetchFromAPI<DuolingoApiResponse>(
    "/v3/duolingo/profile?username=rizkyhaksono",
    {
      method: "GET",
      next: { revalidate: 3600 }, // Cache for 1 hour
    }
  );
}