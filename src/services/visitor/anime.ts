import { fetchBlob } from "@/lib/fetch-utils";

type AnimeType = "waifu" | "neko" | "cringe" | "blush" | "dance";

/**
 * Generic function to fetch anime images by type
 */
async function fetchAnimeImage(type: AnimeType): Promise<Blob> {
  return fetchBlob(`${process.env.NEXT_PUBLIC_API_URL}/v3/tools/anime/${type}`, {
    method: "GET",
    cache: "no-store",
  });
}

export async function getAnimeWaifu(): Promise<Blob> {
  return fetchAnimeImage("waifu");
}

export async function getAnimeNeko(): Promise<Blob> {
  return fetchAnimeImage("neko");
}

export async function getAnimeCringe(): Promise<Blob> {
  return fetchAnimeImage("cringe");
}

export async function getAnimeBlush(): Promise<Blob> {
  return fetchAnimeImage("blush");
}

export async function getAnimeDance(): Promise<Blob> {
  return fetchAnimeImage("dance");
}