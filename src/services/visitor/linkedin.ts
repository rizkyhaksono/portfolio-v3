import { LinkedinRecommendationsApiResponse } from "@/commons/types/linkedin";

export async function getLinkedinRecommendations(): Promise<LinkedinRecommendationsApiResponse> {
  try {
    const apiUrl = process.env.API_URL;

    if (!apiUrl) {
      console.warn("API_URL is not set, returning empty recommendations");
      return { success: false, data: [], total: 0 };
    }

    const response = await fetch(
      `${apiUrl}/v3/linkedin/recommendations`,
      {
        method: "GET",
        next: { revalidate: 86400 }, // Cache for 24 hours
      }
    );

    if (!response.ok) {
      console.error(`LinkedIn API returned status ${response.status}`);
      return { success: false, data: [], total: 0 };
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to fetch LinkedIn recommendations:", error);
    // Return empty data instead of throwing
    return { success: false, data: [], total: 0 };
  }
}