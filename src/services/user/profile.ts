"use server";

import { cookies } from "next/headers";
import { getAuthorizationHeader, revalidateByTag } from "@/app/actions/actions";
import { ProfileResponse } from "@/commons/types/profile";

const getProfile = async (): Promise<ProfileResponse> => {
  const response = await fetch(`${process.env.API_URL}/v3/me`, {
    method: "GET",
    headers: await getAuthorizationHeader(),
    credentials: "include",
    next: {
      tags: ["profile"],
      revalidate: 0,
    }
  });
  return await response.json();
}

const putProfile = async (
  id: string, {
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
  }): Promise<any> => {
  const response = await fetch(`${process.env.API_URL}/v3/me/${id}`, {
    method: "PATCH",
    headers: await getAuthorizationHeader(),
    body: JSON.stringify({
      email,
      name,
      headline,
      location,
      about,
      bannerUrl,
    })
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || `Failed to update profile (${response.status})`);
  }

  revalidateByTag("profile");
  return data;
}

const uploadBannerImage = async (file: File): Promise<{ bannerUrl: string }> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("NATEE_V3_TOKEN")?.value;

  const form = new FormData();
  form.append("file", file);

  const response = await fetch(`${process.env.API_URL}/v3/me/banner`, {
    method: "POST",
    // Do NOT set Content-Type here — fetch sets the multipart boundary automatically.
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || `Failed to upload cover image (${response.status})`);
  }

  revalidateByTag("profile");
  return data?.data ?? { bannerUrl: "" };
}

export {
  getProfile,
  putProfile,
  uploadBannerImage,
}
