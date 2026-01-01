// Client-side admin services for use in client components
// These services use document.cookie for authentication
// Supports both Backend API (Prisma) and Supabase databases

import { getClientAuthorizationHeader } from "@/commons/helpers/client-auth-header"

const API_URL = process.env.NEXT_PUBLIC_API_URL
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// ==================== Types ====================

export type DataSource = "backend" | "supabase"

export interface BackendProject {
  id: string
  image: string
  title: string
  description: string
  content: string
  projectLink: string
  sourceCodeLink?: string
  isFeatured: boolean
  created_at: string
  updated_at: string
}

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

export interface BackendWork {
  id: string
  logo: string
  jobTitle: string
  content: string
  instance: string
  instanceLink: string
  address: string
  duration: string
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

export interface BackendEducation {
  id: string
  logo: string
  instance: string
  content: string
  address: string
  duration: string
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

// ==================== Helpers ====================

function buildUrl(base: string, params: URLSearchParams): string {
  const queryString = params.toString()
  if (queryString) {
    return base + "?" + queryString
  }
  return base
}

function getSupabaseHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    apikey: SUPABASE_ANON_KEY || "",
    Authorization: `Bearer ${SUPABASE_ANON_KEY || ""}`,
  }
}

// ==================== Backend API Services (Prisma) ====================

// Project Services - Backend
export async function getProjectsClient(query?: { page?: number; limit?: number }) {
  const params = new URLSearchParams()
  if (query?.page) params.append("page", query.page.toString())
  if (query?.limit) params.append("limit", query.limit.toString())

  const url = buildUrl(`${API_URL}/v3/project/`, params)
  const response = await fetch(url, {
    method: "GET",
    headers: getClientAuthorizationHeader(),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch projects: ${response.status}`)
  }

  return await response.json()
}

export async function createProjectClient(project: Omit<BackendProject, "id" | "created_at" | "updated_at">) {
  const response = await fetch(`${API_URL}/v3/project/`, {
    method: "POST",
    headers: getClientAuthorizationHeader(),
    body: JSON.stringify(project),
  })

  if (!response.ok) {
    throw new Error(`Failed to create project: ${response.status}`)
  }

  return await response.json()
}

export async function updateProjectClient(id: string, project: Partial<BackendProject>) {
  const response = await fetch(`${API_URL}/v3/project/${id}`, {
    method: "PATCH",
    headers: getClientAuthorizationHeader(),
    body: JSON.stringify(project),
  })

  if (!response.ok) {
    throw new Error(`Failed to update project: ${response.status}`)
  }

  return await response.json()
}

export async function deleteProjectClient(id: string) {
  const response = await fetch(`${API_URL}/v3/project/${id}`, {
    method: "DELETE",
    headers: getClientAuthorizationHeader(),
  })

  if (!response.ok) {
    throw new Error(`Failed to delete project: ${response.status}`)
  }

  return await response.json()
}

// Work Services - Backend
export async function getWorkClient(query?: { page?: number; limit?: number }) {
  const params = new URLSearchParams()
  if (query?.page) params.append("page", query.page.toString())
  if (query?.limit) params.append("limit", query.limit.toString())

  const url = buildUrl(`${API_URL}/v3/work/`, params)
  const response = await fetch(url, {
    method: "GET",
    headers: getClientAuthorizationHeader(),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch work: ${response.status}`)
  }

  return await response.json()
}

export async function createWorkClient(work: Omit<BackendWork, "id" | "created_at" | "updated_at">) {
  const response = await fetch(`${API_URL}/v3/work/`, {
    method: "POST",
    headers: getClientAuthorizationHeader(),
    body: JSON.stringify(work),
  })

  if (!response.ok) {
    throw new Error(`Failed to create work: ${response.status}`)
  }

  return await response.json()
}

export async function updateWorkClient(id: string, work: Partial<BackendWork>) {
  const response = await fetch(`${API_URL}/v3/work/${id}`, {
    method: "PATCH",
    headers: getClientAuthorizationHeader(),
    body: JSON.stringify(work),
  })

  if (!response.ok) {
    throw new Error(`Failed to update work: ${response.status}`)
  }

  return await response.json()
}

export async function deleteWorkClient(id: string) {
  const response = await fetch(`${API_URL}/v3/work/${id}`, {
    method: "DELETE",
    headers: getClientAuthorizationHeader(),
  })

  if (!response.ok) {
    throw new Error(`Failed to delete work: ${response.status}`)
  }

  return await response.json()
}

// Education Services - Backend
export async function getEducationClient(query?: { page?: number; limit?: number }) {
  const params = new URLSearchParams()
  if (query?.page) params.append("page", query.page.toString())
  if (query?.limit) params.append("limit", query.limit.toString())

  const url = buildUrl(`${API_URL}/v3/education/`, params)
  const response = await fetch(url, {
    method: "GET",
    headers: getClientAuthorizationHeader(),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch education: ${response.status}`)
  }

  return await response.json()
}

export async function createEducationClient(education: Omit<BackendEducation, "id" | "created_at" | "updated_at">) {
  const response = await fetch(`${API_URL}/v3/education/`, {
    method: "POST",
    headers: getClientAuthorizationHeader(),
    body: JSON.stringify(education),
  })

  if (!response.ok) {
    throw new Error(`Failed to create education: ${response.status}`)
  }

  return await response.json()
}

export async function updateEducationClient(id: string, education: Partial<BackendEducation>) {
  const response = await fetch(`${API_URL}/v3/education/${id}`, {
    method: "PATCH",
    headers: getClientAuthorizationHeader(),
    body: JSON.stringify(education),
  })

  if (!response.ok) {
    throw new Error(`Failed to update education: ${response.status}`)
  }

  return await response.json()
}

export async function deleteEducationClient(id: string) {
  const response = await fetch(`${API_URL}/v3/education/${id}`, {
    method: "DELETE",
    headers: getClientAuthorizationHeader(),
  })

  if (!response.ok) {
    throw new Error(`Failed to delete education: ${response.status}`)
  }

  return await response.json()
}

// User Services - Backend
export async function getCurrentUserClient() {
  const response = await fetch(`${API_URL}/v3/me/`, {
    method: "GET",
    headers: getClientAuthorizationHeader(),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`)
  }

  return await response.json()
}

export async function getUsersClient(query?: { page?: number; limit?: number }) {
  const params = new URLSearchParams()
  if (query?.page) params.append("page", query.page.toString())
  if (query?.limit) params.append("limit", query.limit.toString())

  const url = buildUrl(`${API_URL}/v3/user/`, params)
  const response = await fetch(url, {
    method: "GET",
    headers: getClientAuthorizationHeader(),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.status}`)
  }

  return await response.json()
}

// Public Chat Services - Backend
export async function getPublicChatsClient(cursor?: string, limit: number = 10) {
  const params = new URLSearchParams()
  if (cursor) params.append("cursor", cursor)
  if (limit) params.append("limit", limit.toString())

  const url = buildUrl(`${API_URL}/v3/public-chat/public-chat/`, params)
  const response = await fetch(url, {
    method: "GET",
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch chats: ${response.status}`)
  }

  return await response.json()
}

// ==================== Supabase Services ====================

// Project Services - Supabase
export async function getSupabaseProjectsClient() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/projects?select=*&order=created_at.desc`, {
    method: "GET",
    headers: getSupabaseHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch Supabase projects: ${response.status}`)
  }

  return (await response.json()) as SupabaseProject[]
}

export async function createSupabaseProjectClient(project: Omit<SupabaseProject, "id" | "created_at" | "updated_at">) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/projects`, {
    method: "POST",
    headers: { ...getSupabaseHeaders(), Prefer: "return=representation" },
    body: JSON.stringify(project),
  })

  if (!response.ok) {
    throw new Error(`Failed to create Supabase project: ${response.status}`)
  }

  const data = await response.json()
  return data[0] as SupabaseProject
}

export async function updateSupabaseProjectClient(id: string, project: Partial<SupabaseProject>) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/projects?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...getSupabaseHeaders(), Prefer: "return=representation" },
    body: JSON.stringify({ ...project, updated_at: new Date().toISOString() }),
  })

  if (!response.ok) {
    throw new Error(`Failed to update Supabase project: ${response.status}`)
  }

  const data = await response.json()
  return data[0] as SupabaseProject
}

export async function deleteSupabaseProjectClient(id: string) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/projects?id=eq.${id}`, {
    method: "DELETE",
    headers: getSupabaseHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to delete Supabase project: ${response.status}`)
  }

  return { success: true }
}

// Career Services - Supabase
export async function getSupabaseCareersClient() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/career?select=*&order=created_at.asc`, {
    method: "GET",
    headers: getSupabaseHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch Supabase careers: ${response.status}`)
  }

  return (await response.json()) as SupabaseCareer[]
}

export async function createSupabaseCareerClient(career: Omit<SupabaseCareer, "id" | "created_at" | "updated_at">) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/career`, {
    method: "POST",
    headers: { ...getSupabaseHeaders(), Prefer: "return=representation" },
    body: JSON.stringify(career),
  })

  if (!response.ok) {
    throw new Error(`Failed to create Supabase career: ${response.status}`)
  }

  const data = await response.json()
  return data[0] as SupabaseCareer
}

export async function updateSupabaseCareerClient(id: string, career: Partial<SupabaseCareer>) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/career?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...getSupabaseHeaders(), Prefer: "return=representation" },
    body: JSON.stringify({ ...career, updated_at: new Date().toISOString() }),
  })

  if (!response.ok) {
    throw new Error(`Failed to update Supabase career: ${response.status}`)
  }

  const data = await response.json()
  return data[0] as SupabaseCareer
}

export async function deleteSupabaseCareerClient(id: string) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/career?id=eq.${id}`, {
    method: "DELETE",
    headers: getSupabaseHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to delete Supabase career: ${response.status}`)
  }

  return { success: true }
}

// Education Services - Supabase
export async function getSupabaseEducationsClient() {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/education?select=*&order=created_at.asc`, {
    method: "GET",
    headers: getSupabaseHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch Supabase educations: ${response.status}`)
  }

  return (await response.json()) as SupabaseEducation[]
}

export async function createSupabaseEducationClient(education: Omit<SupabaseEducation, "id" | "created_at" | "updated_at">) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/education`, {
    method: "POST",
    headers: { ...getSupabaseHeaders(), Prefer: "return=representation" },
    body: JSON.stringify(education),
  })

  if (!response.ok) {
    throw new Error(`Failed to create Supabase education: ${response.status}`)
  }

  const data = await response.json()
  return data[0] as SupabaseEducation
}

export async function updateSupabaseEducationClient(id: string, education: Partial<SupabaseEducation>) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/education?id=eq.${id}`, {
    method: "PATCH",
    headers: { ...getSupabaseHeaders(), Prefer: "return=representation" },
    body: JSON.stringify({ ...education, updated_at: new Date().toISOString() }),
  })

  if (!response.ok) {
    throw new Error(`Failed to update Supabase education: ${response.status}`)
  }

  const data = await response.json()
  return data[0] as SupabaseEducation
}

export async function deleteSupabaseEducationClient(id: string) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/education?id=eq.${id}`, {
    method: "DELETE",
    headers: getSupabaseHeaders(),
  })

  if (!response.ok) {
    throw new Error(`Failed to delete Supabase education: ${response.status}`)
  }

  return { success: true }
}

// ==================== Analytics ====================

export async function getBackendAnalyticsClient() {
  const [projectsRes, workRes, educationRes, usersRes, chatsRes] = await Promise.all([
    getProjectsClient({ page: 1, limit: 1 }),
    getWorkClient({ page: 1, limit: 1 }),
    getEducationClient({ page: 1, limit: 1 }),
    getUsersClient({ page: 1, limit: 1 }).catch(() => ({ total: 0 })),
    getPublicChatsClient(undefined, 1).catch(() => ({ total: 0 })),
  ])

  return {
    projects: projectsRes.total || projectsRes.data?.length || 0,
    work: workRes.total || workRes.data?.length || 0,
    education: educationRes.total || educationRes.data?.length || 0,
    users: usersRes.total || usersRes.data?.length || 0,
    publicChats: chatsRes.total || chatsRes.data?.length || 0,
  }
}

export async function getSupabaseAnalyticsClient() {
  const [projects, careers, educations] = await Promise.all([
    getSupabaseProjectsClient().catch(() => []),
    getSupabaseCareersClient().catch(() => []),
    getSupabaseEducationsClient().catch(() => []),
  ])

  return {
    projects: projects.length,
    careers: careers.length,
    educations: educations.length,
  }
}

export async function getDualDatabaseAnalyticsClient() {
  const [backend, supabase] = await Promise.all([
    getBackendAnalyticsClient().catch(() => ({ projects: 0, work: 0, education: 0, users: 0, publicChats: 0 })),
    getSupabaseAnalyticsClient().catch(() => ({ projects: 0, careers: 0, educations: 0 })),
  ])

  return { backend, supabase }
}
