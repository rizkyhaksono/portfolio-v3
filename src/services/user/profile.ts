"use server";

import { getAuthorizationHeader, revalidateByTag } from "@/app/actions";
import { ProfileResponse } from "@/commons/types/profile";

const getProfile = async (): Promise<ProfileResponse> => {
  const response = await fetch(`${process.env.API_URL}/user`, {
    method: "GET",
    headers: await getAuthorizationHeader(),
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
    about
  }: {
    email: string,
    name: string,
    headline: string,
    location: string,
    about: string,
  }): Promise<any> => {
  const response = await fetch(`${process.env.API_URL}/user/${id}`, {
    method: "PATCH",
    headers: await getAuthorizationHeader(),
    body: JSON.stringify({
      email,
      email_verified: true,
      name,
      headline,
      location,
      about,
      bannerUrl: "",
      icon_url: ""
    })
  });
  return await response.json();
}

export {
  getProfile,
  putProfile
}