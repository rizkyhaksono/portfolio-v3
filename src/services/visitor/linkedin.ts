import { LinkedinRecommendationsApiResponse, LinkedinCertificationsResponse } from "@/commons/types/linkedin";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

export async function getLinkedinRecommendations(): Promise<LinkedinRecommendationsApiResponse> {
  try {
    const url = `${API_URL}/v3/linkedin/recommendations`;

    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch LinkedIn recommendations: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function getLinkedinCertifications(page: number = 1, limit: number = 10): Promise<LinkedinCertificationsResponse> {
  try {
    const url = `${API_URL}/v3/linkedin/certifications?page=${page}&limit=${limit}`;

    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch LinkedIn certifications: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}