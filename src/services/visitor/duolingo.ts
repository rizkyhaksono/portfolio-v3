import { DuolingoApiResponse } from "@/commons/types/duolingo";

const EMPTY_DUOLINGO_RESPONSE: DuolingoApiResponse = {
  success: false,
  data: {
    username: "",
    name: "",
    streak: 0,
    totalXp: 0,
    lingots: 0,
    gems: 0,
    courses: [],
  },
};

export async function getDuolingoProfile(): Promise<DuolingoApiResponse> {
  try {
    const response = await fetch(`${process.env.API_URL}/v3/duolingo/profile?username=rizkyhaksono`, {
      method: "GET",
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error(`Duolingo API returned ${response.status}`);
      return EMPTY_DUOLINGO_RESPONSE;
    }

    const text = await response.text();
    // Check if response is HTML (error page) instead of JSON
    if (text.startsWith('<!DOCTYPE') || text.startsWith('<html')) {
      console.error('Duolingo API returned HTML instead of JSON');
      return EMPTY_DUOLINGO_RESPONSE;
    }

    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to fetch Duolingo profile:', error);
    return EMPTY_DUOLINGO_RESPONSE;
  }
}