"use server";

import { revalidatePath } from "next/cache";
import { serverApiUrl } from "@/lib/api-base";
import { authHeaders, getSessionToken } from "@/lib/session";
import { ProfileData } from "@/commons/types/profile";

const MAX_BANNER_BYTES = 5 * 1024 * 1024;
const BANNER_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp"];

/** `data` is set only on success; callers branch on `status` (401 = the session ended). */
const getProfile = async (): Promise<{ status: number; data?: ProfileData }> => {
  const response = await fetch(`${serverApiUrl()}/v3/me`, {
    headers: await authHeaders(),
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });
  const json = await response.json().catch(() => null);
  return { status: response.status, data: response.ok ? json?.data : undefined };
}

// Results, not throws: production masks the message of an error thrown from a Server Action.
const putProfile = async ({
    email,
    name,
    headline,
    location,
    about,
    bannerUrl
  }: {
    email: string,
    name: string,
    headline: string,
    location: string,
    about: string,
    bannerUrl: string
  }): Promise<{ ok: boolean; message?: string }> => {
  if (bannerUrl && !/^https:\/\//i.test(bannerUrl)) {
    return { ok: false, message: "The cover image link must start with https://." };
  }
  // The API edits the signed-in account whatever the id; the session's own id keeps the URL honest.
  const me = await getProfile();
  if (!me.data?.id) return { ok: false, message: "Your session ended. Sign in again to save." };

  const response = await fetch(`${serverApiUrl()}/v3/me/${encodeURIComponent(me.data.id)}`, {
    method: "PATCH",
    headers: await authHeaders(),
    body: JSON.stringify({
      email,
      name,
      headline,
      location,
      about,
      bannerUrl,
    })
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);
    return { ok: false, message: data?.message || `Your changes were not saved (error ${response.status}).` };
  }

  revalidatePath("/profile");
  return { ok: true };
}

const uploadBannerImage = async (file: File): Promise<{ bannerUrl: string; message?: string }> => {
  if (!BANNER_TYPES.includes(file.type)) return { bannerUrl: "", message: "Choose a PNG, JPG, GIF or WebP image." };
  if (file.size > MAX_BANNER_BYTES) return { bannerUrl: "", message: "That image is over 5 MB. Choose a smaller one." };

  const token = await getSessionToken();

  const form = new FormData();
  form.append("file", file);

  const response = await fetch(`${serverApiUrl()}/v3/me/banner`, {
    method: "POST",
    // Do NOT set Content-Type here — fetch sets the multipart boundary automatically.
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.data?.bannerUrl) {
    return { bannerUrl: "", message: data?.message || `The cover image was not uploaded (error ${response.status}).` };
  }

  revalidatePath("/profile");
  return { bannerUrl: data.data.bannerUrl };
}

export {
  getProfile,
  putProfile,
  uploadBannerImage,
}
