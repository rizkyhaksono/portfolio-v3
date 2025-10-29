import { LinkedinRecommendationsApiResponse } from "@/commons/types/linkedin";

export async function getLinkedinRecommendations(): Promise<LinkedinRecommendationsApiResponse> {
  const response = await fetch(`https://api.nateee.com/v3/linkedin/recommendations`,
    {
      method: "GET",
      next: { revalidate: 86400 }, // Cache for 24 hours
    }
  );

  return await response.json();
}