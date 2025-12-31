"use server";

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
  const response = await fetch(`${process.env.API_URL}/me/${id}`, {
    method: "PATCH",
    headers: await getAuthorizationHeader(),
    body: JSON.stringify({
      email,
      emailVerified: true,
      name,
      headline,
      location,
      about,
      bannerUrl,
    })
  });
  revalidateByTag("profile");
  return await response.json();
}

export {
  getProfile,
  putProfile
}