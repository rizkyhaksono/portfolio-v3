import { LinkedinRecommendationsApiResponse, LinkedinCertificationsResponse } from "@/commons/types/linkedin";

const API_URL = process.env.API_URL

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
    const response = await fetch(`${API_URL}/v3/linkedin/recommendations`, {
      method: "GET",
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(`LinkedIn recommendations API returned ${response.status}`);
      return EMPTY_RECOMMENDATIONS;
    }

    const text = await response.text();
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
    const response = await fetch(`${API_URL}/v3/linkedin/certifications?page=${page}&limit=${limit}`, {
      method: "GET",
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(`LinkedIn certifications API returned ${response.status}`);
      return { ...EMPTY_CERTIFICATIONS, page, limit };
    }

    const text = await response.text();
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