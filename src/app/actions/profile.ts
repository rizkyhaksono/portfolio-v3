"use server";

import { putProfile, uploadBannerImage } from "@/services/user/profile";

export async function updateProfile(id: string, formData: FormData) {
  const profileData = {
    email: formData.get("email") as string,
    name: formData.get("name") as string,
    headline: formData.get("headline") as string,
    location: formData.get("location") as string,
    about: formData.get("about") as string,
    bannerUrl: formData.get("bannerUrl") as string,
  };
  return await putProfile(id, profileData);
}

export async function uploadProfileBanner(formData: FormData): Promise<{ bannerUrl: string }> {
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Please select an image to upload.");
  }
  return await uploadBannerImage(file);
}
