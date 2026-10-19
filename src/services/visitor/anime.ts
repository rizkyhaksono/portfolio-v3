const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type AnimeImageType = "waifu" | "neko" | "cringe" | "blush" | "dance";

export interface AnimeQuote {
  content: string;
  anime: { name: string };
  character: { name: string };
}

/** The API streams a PNG or GIF of about 5 MB. */
export async function getAnimeImage(type: AnimeImageType, signal?: AbortSignal): Promise<Blob> {
  const res = await fetch(`${API_URL}/v3/tools/anime/${type}`, { signal });
  if (!res.ok) throw new Error("Failed to fetch anime image");
  return res.blob();
}

export async function getAnimeQuote(): Promise<AnimeQuote> {
  const res = await fetch(`${API_URL}/v3/tools/anime/quote`);
  if (res.status === 429) throw new Error("Too many requests");
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.data) throw new Error("Failed to fetch anime quote");
  return json.data;
}
