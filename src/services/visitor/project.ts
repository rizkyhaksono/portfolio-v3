"use server";

import { supabaseUser } from "@/supabase/server";
import { authHeaders } from "@/lib/header.config";

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
  const { data } = await supabaseUser
    .from("projects")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  return data as projectType[];
};

export const getSupabaseProjectById = async (id: string) => {
  const { data } = await supabaseUser
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  return data as projectType;
}

export const getProjects = async () => {
  const response = await fetch(`${process.env.API_URL}/project`,
    {
      method: "GET",
      headers: await authHeaders(),
      next: {
        revalidate: 0,
      }
    }
  ).then(async (res) => await res.json());
  return response;
}

export const getProjectById = async (id: number) => {
  const response = await fetch(`${process.env.API_URL}/project/${id}`,
    {
      method: "GET",
      headers: await authHeaders(),
      next: {
        revalidate: 0,
      }
    }
  ).then(async (res) => await res.json());
  return response;
}