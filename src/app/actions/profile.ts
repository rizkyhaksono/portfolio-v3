"use server";

import { putProfile } from "@/services/user/profile";
import { toast } from "sonner";

export async function updateProfile(id: string, formData: FormData) {
  const profileData = {
    email: formData.get("email") as string,
    name: formData.get("name") as string,
    headline: formData.get("headline") as string,
    location: formData.get("location") as string,
    about: formData.get("about") as string,
    bannerUrl: formData.get("bannerUrl") as string,
  };
  toast.promise(await putProfile(id, profileData), {
    loading: "Updating profile...",
    success: "Profile updated!",
    error: "Failed to update profile.",
  });
}