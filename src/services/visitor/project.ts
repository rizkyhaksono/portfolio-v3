"use server";

import { getAllFromTable, getByIdFromTable } from "@/lib/supabase-utils";
import { authHeaders } from "@/lib/header.config";
import { fetchAPI } from "@/lib/fetch-utils";

type projectType = {
  id: string;
  title: string;
  description: string;
  url: string;
  created_at: string;
  updated_at: string;
  image: string | null;
  source_code: string | null;
};

export const getAllProject = async () => {
  return getAllFromTable<projectType>("projects", "created_at", false);
};

export const getSupabaseProjectById = async (id: string) => {
  return getByIdFromTable<projectType>("projects", id);
}

export const getProjects = async () => {
  return fetchAPI(`${process.env.API_URL}/project`, {
    method: "GET",
    headers: await authHeaders(),
    next: {
      revalidate: 0,
    }
  });
}

export const getProjectById = async (id: number) => {
  return fetchAPI(`${process.env.API_URL}/project/${id}`, {
    method: "GET",
    headers: await authHeaders(),
    next: {
      revalidate: 0,
    }
  });
}