import type { SocialMediaDownloadResult } from "@/commons/types/tools";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Universal downloader — one backend endpoint (powered by self-hosted Cobalt)
 * handles every platform; it auto-detects YouTube / TikTok / Instagram / X / Facebook
 * from the URL.
 */
async function download(url: string): Promise<SocialMediaDownloadResult> {
  const response = await fetch(`${API_URL}/v3/tools/download?url=${encodeURIComponent(url)}`, {
    method: "GET",
  });

  const json = await response.json().catch(() => null);
  if (!response.ok || !json || json.status >= 400 || !json.data) {
    throw new Error(json?.message || "Failed to download. Check the URL and try again.");
  }
  return json;
}

export async function downloadFromFacebook(url: string): Promise<SocialMediaDownloadResult> {
  return download(url);
}

export async function downloadFromInstagram(url: string): Promise<SocialMediaDownloadResult> {
  return download(url);
}

export async function downloadFromTikTok(url: string): Promise<SocialMediaDownloadResult> {
  return download(url);
}

export async function downloadFromX(url: string): Promise<SocialMediaDownloadResult> {
  return download(url);
}

export async function downloadFromYouTube(url: string): Promise<SocialMediaDownloadResult> {
  return download(url);
}
