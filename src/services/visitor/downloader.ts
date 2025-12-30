import type { SocialMediaDownloadResult, InstagramDownloadResponse } from "@/commons/types/tools";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function downloadFromFacebook(url: string): Promise<SocialMediaDownloadResult> {
  const response = await fetch(`${API_URL}/v3/tools/facebook/downloader?url=${encodeURIComponent(url)}`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to download from Facebook");
  return await response.json();
}

// NOTE: Instagram downloader API endpoint not available in API spec
// This is a placeholder that will throw an error until the backend endpoint is added
export async function downloadFromInstagram(url: string): Promise<InstagramDownloadResponse | SocialMediaDownloadResult> {
  const response = await fetch(`${API_URL}/v3/tools/instagram/downloader?url=${encodeURIComponent(url)}`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to download from Instagram");
  return await response.json();
}

export async function downloadFromTikTok(url: string): Promise<SocialMediaDownloadResult> {
  const response = await fetch(`${API_URL}/v3/tools/tiktok/downloader?url=${encodeURIComponent(url)}`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to download from TikTok");
  return await response.json();
}

export async function downloadFromX(url: string): Promise<SocialMediaDownloadResult> {
  const response = await fetch(`${API_URL}/v3/tools/x/downloader?url=${encodeURIComponent(url)}`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("Failed to download from X/Twitter");
  return await response.json();
}

// NOTE: YouTube downloader API endpoint not available in API spec
// This is a placeholder that will throw an error until the backend endpoint is added
export async function downloadFromYouTube(url: string): Promise<SocialMediaDownloadResult> {
  // TODO: Replace with actual endpoint when /v3/tools/youtube/downloader is available
  const response = await fetch(`${API_URL}/v3/tools/youtube/downloader?url=${encodeURIComponent(url)}`, {
    method: "GET",
  });
  if (!response.ok) throw new Error("YouTube downloader API not yet available");
  return await response.json();
}
