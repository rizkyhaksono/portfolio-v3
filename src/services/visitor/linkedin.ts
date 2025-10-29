import { LinkedinRecommendationsApiResponse } from "@/commons/types/linkedin";
import { fetchFromAPI } from "@/lib/fetch-utils";

export async function getLinkedinRecommendations(): Promise<LinkedinRecommendationsApiResponse> {
  return fetchFromAPI<LinkedinRecommendationsApiResponse>(
    "/v3/linkedin/recommendations",
    {
      method: "GET",
      next: { revalidate: 86400 }, // Cache for 24 hours
    }
  );
}