import { LinkedinRecommendationsApiResponse } from "@/commons/types/linkedin";

export async function getLinkedinRecommendations(): Promise<LinkedinRecommendationsApiResponse> {
  const response = await fetch(
    `${process.env.API_URL}/v3/linkedin/recommendations`,
    {
      method: "GET",
      next: { revalidate: 86400 }, // Cache for 24 hours
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch LinkedIn recommendations");
  }

  return await response.json();
}