const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getAnimeWaifu(): Promise<Blob> {
  const response = await fetch(`${API_URL}/v3/tools/anime/waifu`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch anime waifu");
  return response.blob();
}

export async function getAnimeNeko(): Promise<Blob> {
  const response = await fetch(`${API_URL}/v3/tools/anime/neko`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch anime neko");
  return response.blob();
}

export async function getAnimeCringe(): Promise<Blob> {
  const response = await fetch(`${API_URL}/v3/tools/anime/cringe`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch anime cringe");
  return response.blob();
}

export async function getAnimeBlush(): Promise<Blob> {
  const response = await fetch(`${API_URL}/v3/tools/anime/blush`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch anime blush");
  return response.blob();
}

export async function getAnimeDance(): Promise<Blob> {
  const response = await fetch(`${API_URL}/v3/tools/anime/dance`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to fetch anime dance");
  return response.blob();
}

export async function getAnimeQuote(): Promise<any> {
  const response = await fetch(`${API_URL}/v3/tools/anime/quote`, {
    method: "GET",
  });

  const data = await response.json();

  // Check for rate limit error or other errors in response body
  if (data.message && !data.data) {
    throw new Error(data.message);
  }

  if (!response.ok) {
    throw new Error("Failed to fetch anime quote");
  }

  return data;
}

export async function getAnimeQuoteByName(name: string): Promise<any> {
  const response = await fetch(`${API_URL}/v3/tools/anime/${encodeURIComponent(name)}/quote`, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error("Failed to fetch anime quote");
  }

  return data;
}