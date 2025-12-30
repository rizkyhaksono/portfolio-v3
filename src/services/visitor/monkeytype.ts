import {
  MonkeyTypeStats,
  MonkeyTypePersonalBests,
  MonkeyTypeUserData,
  EMPTY_MONKEYTYPE,
} from "@/commons/types/monkeytype";

const MONKEYTYPE_API_URL = "https://api.monkeytype.com";
const API_KEY = process.env.MONKEYTYPE_API_KEY;

export async function getMonkeyTypeStats(): Promise<MonkeyTypeStats | null> {
  if (!API_KEY) {
    console.warn("MONKEYTYPE_API_KEY not configured");
    return null;
  }

  try {
    const response = await fetch(`${MONKEYTYPE_API_URL}/users/stats`, {
      method: "GET",
      headers: {
        Authorization: `ApeKey ${API_KEY}`,
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 471) {
        console.error(`MonkeyType stats API returned ${response.status}`);
      }
      return null;
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("Failed to fetch MonkeyType stats:", error);
    return null;
  }
}

export async function getMonkeyTypePersonalBests(): Promise<MonkeyTypePersonalBests | null> {
  if (!API_KEY) {
    return null;
  }

  try {
    const response = await fetch(`${MONKEYTYPE_API_URL}/users/personalBests`, {
      method: "GET",
      headers: {
        Authorization: `ApeKey ${API_KEY}`,
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      if (response.status !== 401 && response.status !== 471) {
        console.error(`MonkeyType personal bests API returned ${response.status}`);
      }
      return null;
    }

    const result = await response.json();
    return result.data || null;
  } catch (error) {
    console.error("Failed to fetch MonkeyType personal bests:", error);
    return null;
  }
}

export async function getMonkeyTypeData(): Promise<MonkeyTypeUserData> {
  try {
    const [stats, personalBests] = await Promise.all([
      getMonkeyTypeStats(),
      getMonkeyTypePersonalBests(),
    ]);

    let bestWpm = 0;
    let bestAccuracy = 0;

    if (personalBests?.time) {
      const timeTests = ["60", "30", "15"];
      for (const time of timeTests) {
        if (personalBests.time[time]?.length > 0) {
          const best = personalBests.time[time].reduce(
            (a, b) => (a.wpm > b.wpm ? a : b),
            personalBests.time[time][0]
          );
          if (best.wpm > bestWpm) {
            bestWpm = Math.round(best.wpm);
            bestAccuracy = Math.round(best.acc);
          }
        }
      }
    }

    return {
      stats,
      personalBests,
      bestWpm,
      bestAccuracy,
      averageWpm: 0,
    };
  } catch (error) {
    console.error("Failed to fetch MonkeyType data:", error);
    return EMPTY_MONKEYTYPE;
  }
}
