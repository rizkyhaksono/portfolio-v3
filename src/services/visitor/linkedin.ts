import { LinkedinRecommendationsApiResponse, LinkedinCertificationsResponse } from "@/commons/types/linkedin";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

const EMPTY_RECOMMENDATIONS: LinkedinRecommendationsApiResponse = {
  success: false,
  data: [],
  total: 0,
};

const EMPTY_CERTIFICATIONS: LinkedinCertificationsResponse = {
  success: false,
  data: [],
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  prev: null,
  next: null,
};

export async function getLinkedinRecommendations(): Promise<LinkedinRecommendationsApiResponse> {
  try {
    const url = `${API_URL}/v3/linkedin/recommendations`;

    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      next: { revalidate: 3600 }, // Cache for 1 hour to reduce API calls
    });

    if (!response.ok) {
      console.error(`LinkedIn recommendations API returned ${response.status}`);
      return EMPTY_RECOMMENDATIONS;
    }

    const text = await response.text();
    // Check if response is HTML (error page) instead of JSON
    if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
      console.error('LinkedIn recommendations API returned HTML instead of JSON');
      return EMPTY_RECOMMENDATIONS;
    }

    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to fetch LinkedIn recommendations:', error);
    return EMPTY_RECOMMENDATIONS;
  }
}

export async function getLinkedinCertifications(page: number = 1, limit: number = 10): Promise<LinkedinCertificationsResponse> {
  try {
    const url = `${API_URL}/v3/linkedin/certifications?page=${page}&limit=${limit}`;

    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      next: { revalidate: 3600 }, // Cache for 1 hour to reduce API calls
    });

    if (!response.ok) {
      console.error(`LinkedIn certifications API returned ${response.status}`);
      return { ...EMPTY_CERTIFICATIONS, page, limit };
    }

    const text = await response.text();
    // Check if response is HTML (error page) instead of JSON
    if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
      console.error('LinkedIn certifications API returned HTML instead of JSON');
      return { ...EMPTY_CERTIFICATIONS, page, limit };
    }

    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to fetch LinkedIn certifications:', error);
    return { ...EMPTY_CERTIFICATIONS, page, limit };
  }
}