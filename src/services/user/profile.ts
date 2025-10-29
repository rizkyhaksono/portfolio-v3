"use server";

import { getAuthorizationHeader, revalidateByTag } from "@/app/actions/actions";
import { ProfileResponse } from "@/commons/types/profile";
import { fetchFromAPIWithoutThrow } from "@/lib/fetch-utils";

const getProfile = async (): Promise<ProfileResponse> => {
  return fetchFromAPIWithoutThrow<ProfileResponse>("/me", {
    method: "GET",
    headers: await getAuthorizationHeader(),
    next: {
      tags: ["profile"],
      revalidate: 0,
    }
  });
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
  const response = await fetchFromAPIWithoutThrow(`/me/${id}`, {
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
  return response;
}

export {
  getProfile,
  putProfile
}