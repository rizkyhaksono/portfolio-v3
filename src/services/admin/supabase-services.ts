// Supabase admin services for CRUD operations
// These services interact with the Supabase database

import { supabaseAdmin, supabaseUser } from "@/supabase/server"

// ==================== Types ====================

export interface SupabaseProject {
  id: string
  title: string
  description: string
  url: string | null
  source_code: string | null
  image: string | null
  created_at: string
  updated_at: string
}

export interface SupabaseCareer {
  id: string
  title: string
  subtitle: string
  duration: string
  image: string | null
  created_at: string
  updated_at: string
}

export interface SupabaseEducation {
  id: string
  title: string
  subtitle: string
  duration: string
  image: string
  created_at: string
  updated_at: string
}

// ==================== Project Services ====================

export async function getSupabaseProjects() {
  const { data, error } = await supabaseUser
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw new Error(`Failed to fetch projects: ${error.message}`)
  return data as SupabaseProject[]
}

export async function getSupabaseProjectById(id: string) {
  const { data, error } = await supabaseUser
    .from("projects")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw new Error(`Failed to fetch project: ${error.message}`)
  return data as SupabaseProject
}

export async function createSupabaseProject(project: Omit<SupabaseProject, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .insert(project)
    .select()
    .single()

  if (error) throw new Error(`Failed to create project: ${error.message}`)
  return data as SupabaseProject
}

export async function updateSupabaseProject(id: string, project: Partial<SupabaseProject>) {
  const { data, error } = await supabaseAdmin
    .from("projects")
    .update({ ...project, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(`Failed to update project: ${error.message}`)
  return data as SupabaseProject
}

export async function deleteSupabaseProject(id: string) {
  const { error } = await supabaseAdmin
    .from("projects")
    .delete()
    .eq("id", id)

  if (error) throw new Error(`Failed to delete project: ${error.message}`)
  return { success: true }
}

// ==================== Career Services ====================

export async function getSupabaseCareers() {
  const { data, error } = await supabaseUser
    .from("career")
    .select("*")
    .order("created_at", { ascending: true })

  if (error) throw new Error(`Failed to fetch careers: ${error.message}`)
  return data as SupabaseCareer[]
}

export async function getSupabaseCareerById(id: string) {
  const { data, error } = await supabaseUser
    .from("career")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw new Error(`Failed to fetch career: ${error.message}`)
  return data as SupabaseCareer
}

export async function createSupabaseCareer(career: Omit<SupabaseCareer, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabaseAdmin
    .from("career")
    .insert(career)
    .select()
    .single()

  if (error) throw new Error(`Failed to create career: ${error.message}`)
  return data as SupabaseCareer
}

export async function updateSupabaseCareer(id: string, career: Partial<SupabaseCareer>) {
  const { data, error } = await supabaseAdmin
    .from("career")
    .update({ ...career, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(`Failed to update career: ${error.message}`)
  return data as SupabaseCareer
}

export async function deleteSupabaseCareer(id: string) {
  const { error } = await supabaseAdmin
    .from("career")
    .delete()
    .eq("id", id)

  if (error) throw new Error(`Failed to delete career: ${error.message}`)
  return { success: true }
}

// ==================== Education Services ====================

export async function getSupabaseEducations() {
  const { data, error } = await supabaseUser
    .from("education")
    .select("*")
    .order("created_at", { ascending: true })

  if (error) throw new Error(`Failed to fetch educations: ${error.message}`)
  return data as SupabaseEducation[]
}

export async function getSupabaseEducationById(id: string) {
  const { data, error } = await supabaseUser
    .from("education")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw new Error(`Failed to fetch education: ${error.message}`)
  return data as SupabaseEducation
}

export async function createSupabaseEducation(education: Omit<SupabaseEducation, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabaseAdmin
    .from("education")
    .insert(education)
    .select()
    .single()

  if (error) throw new Error(`Failed to create education: ${error.message}`)
  return data as SupabaseEducation
}

export async function updateSupabaseEducation(id: string, education: Partial<SupabaseEducation>) {
  const { data, error } = await supabaseAdmin
    .from("education")
    .update({ ...education, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw new Error(`Failed to update education: ${error.message}`)
  return data as SupabaseEducation
}

export async function deleteSupabaseEducation(id: string) {
  const { error } = await supabaseAdmin
    .from("education")
    .delete()
    .eq("id", id)

  if (error) throw new Error(`Failed to delete education: ${error.message}`)
  return { success: true }
}

// ==================== Analytics ====================

export async function getSupabaseAnalytics() {
  const [projectsResult, careersResult, educationsResult] = await Promise.all([
    supabaseUser.from("projects").select("*", { count: "exact", head: true }),
    supabaseUser.from("career").select("*", { count: "exact", head: true }),
    supabaseUser.from("education").select("*", { count: "exact", head: true }),
  ])

  return {
    projects: projectsResult.count || 0,
    careers: careersResult.count || 0,
    educations: educationsResult.count || 0,
  }
}
