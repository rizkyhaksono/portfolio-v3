import { z } from "zod"
import {
  createEducationClient,
  createProjectClient,
  createSupabaseCareerClient,
  createSupabaseEducationClient,
  createSupabaseProjectClient,
  createWorkClient,
  deleteEducationClient,
  deleteProjectClient,
  deleteSupabaseCareerClient,
  deleteSupabaseEducationClient,
  deleteSupabaseProjectClient,
  deleteWorkClient,
  getEducationClient,
  getProjectsClient,
  getSupabaseCareersClient,
  getSupabaseEducationsClient,
  getSupabaseProjectsClient,
  getWorkClient,
  updateEducationClient,
  updateProjectClient,
  updateSupabaseCareerClient,
  updateSupabaseEducationClient,
  updateSupabaseProjectClient,
  updateWorkClient,
  type BackendEducation,
  type BackendProject,
  type BackendWork,
  type SupabaseCareer,
  type SupabaseEducation,
  type SupabaseProject,
} from "@/services/admin/client-services"
import { formatDay } from "@/components/layout/admin/admin-format"
import type { CollectionProps } from "./collection"

// Validation is unchanged from the old dialogs; only the wording is new.
const text = (what: string, min = 2) => z.string().trim().min(min, `${what} needs at least ${min} characters.`)
const url = z.string().trim().url("Use a full address, starting with https://.")
const optional = z.string().trim()
const orNull = (value: string) => value || null

const added = (iso?: string | null) => (formatDay(iso) ? `Added ${formatDay(iso)}` : undefined)

/* Supabase: the tables the site reads. */

const supabaseProjectSchema = z.object({
  title: text("The title"),
  description: text("The description", 10),
  url: optional,
  source_code: optional,
  image: optional,
})

export const supabaseProjects: CollectionProps<SupabaseProject, z.infer<typeof supabaseProjectSchema>> = {
  noun: "project",
  plural: "projects",
  heading: "Projects",
  note: "Supabase, read by /project and the home page.",
  schema: supabaseProjectSchema,
  blank: { title: "", description: "", url: "", source_code: "", image: "" },
  fields: [
    { name: "title", label: "Title", placeholder: "Etan AI" },
    { name: "description", label: "Description", kind: "rich", placeholder: "What it does and how it was built…" },
    { name: "url", label: "Live site", kind: "url", placeholder: "https://…", half: true },
    { name: "source_code", label: "Source code", kind: "url", placeholder: "https://github.com/…", half: true },
    { name: "image", label: "Image", kind: "url", placeholder: "https://…/cover.png" },
  ],
  load: getSupabaseProjectsClient,
  save: (v, editing) => {
    const payload = { ...v, url: orNull(v.url), source_code: orNull(v.source_code), image: orNull(v.image) }
    return editing ? updateSupabaseProjectClient(editing.id, payload) : createSupabaseProjectClient(payload)
  },
  remove: (project) => deleteSupabaseProjectClient(project.id),
  toValues: (p) => ({ title: p.title ?? "", description: p.description ?? "", url: p.url ?? "", source_code: p.source_code ?? "", image: p.image ?? "" }),
  view: (p) => ({ title: p.title, text: p.description, meta: added(p.created_at), link: { href: `/project/${p.id}`, label: "View on the site" } }),
}

const supabaseCareerSchema = z.object({ title: text("The role"), subtitle: text("The company"), duration: text("The duration"), image: optional })

export const supabaseCareer: CollectionProps<SupabaseCareer, z.infer<typeof supabaseCareerSchema>> = {
  noun: "career entry",
  plural: "career entries",
  heading: "Career",
  note: "Supabase, read by the home Career ledger.",
  schema: supabaseCareerSchema,
  blank: { title: "", subtitle: "", duration: "", image: "" },
  fields: [
    { name: "title", label: "Role", placeholder: "Senior AI Engineer" },
    { name: "subtitle", label: "Company and place", placeholder: "Sarana AI, Malang" },
    { name: "duration", label: "Duration", placeholder: "January 2024 to now", half: true },
    { name: "image", label: "Logo", kind: "url", placeholder: "https://…/logo.png", note: "Optional.", half: true },
  ],
  load: getSupabaseCareersClient,
  save: (v, editing) => {
    const payload = { ...v, image: orNull(v.image) }
    return editing ? updateSupabaseCareerClient(editing.id, payload) : createSupabaseCareerClient(payload)
  },
  remove: (career) => deleteSupabaseCareerClient(career.id),
  toValues: (c) => ({ title: c.title ?? "", subtitle: c.subtitle ?? "", duration: c.duration ?? "", image: c.image ?? "" }),
  view: (c) => ({ title: c.title, text: c.subtitle, meta: c.duration }),
}

const supabaseEducationSchema = z.object({ title: text("The programme"), subtitle: text("The institution"), duration: text("The duration"), image: url })

export const supabaseEducation: CollectionProps<SupabaseEducation, z.infer<typeof supabaseEducationSchema>> = {
  noun: "education entry",
  plural: "education entries",
  heading: "Education",
  note: "Supabase, read by the home Career ledger.",
  schema: supabaseEducationSchema,
  blank: { title: "", subtitle: "", duration: "", image: "" },
  fields: [
    { name: "title", label: "Programme", placeholder: "Bachelor of Informatics" },
    { name: "subtitle", label: "Institution", placeholder: "University name" },
    { name: "duration", label: "Duration", placeholder: "2019 to 2023", half: true },
    { name: "image", label: "Logo", kind: "url", placeholder: "https://…/logo.png", half: true },
  ],
  load: getSupabaseEducationsClient,
  save: (v, editing) => (editing ? updateSupabaseEducationClient(editing.id, v) : createSupabaseEducationClient(v)),
  remove: (education) => deleteSupabaseEducationClient(education.id),
  toValues: (e) => ({ title: e.title ?? "", subtitle: e.subtitle ?? "", duration: e.duration ?? "", image: e.image ?? "" }),
  view: (e) => ({ title: e.title, text: e.subtitle, meta: e.duration }),
}

/* Legacy Prisma API: kept for comparison until the owner archives it. */

const LEGACY_NOTE = "The legacy Prisma API. The site no longer reads it."
const listOf = <T,>(response: { data?: T[] }) => response.data ?? []

const backendProjectSchema = z.object({
  title: text("The title"),
  description: text("The summary", 10),
  content: text("The write-up", 10),
  projectLink: optional,
  sourceCodeLink: optional,
  image: url,
  isFeatured: z.boolean(),
})

const loadBackendProjects = async () => listOf<BackendProject>(await getProjectsClient({ page: 1, limit: 50 }))

export const backendProjects: CollectionProps<BackendProject, z.infer<typeof backendProjectSchema>> = {
  noun: "project",
  plural: "projects",
  heading: "Legacy projects",
  note: LEGACY_NOTE,
  schema: backendProjectSchema,
  blank: { title: "", description: "", content: "", projectLink: "", sourceCodeLink: "", image: "", isFeatured: false },
  fields: [
    { name: "title", label: "Title" },
    { name: "description", label: "Summary", kind: "textarea" },
    { name: "content", label: "Write-up", kind: "rich" },
    { name: "projectLink", label: "Live site", kind: "url", placeholder: "https://…", half: true },
    { name: "sourceCodeLink", label: "Source code", kind: "url", placeholder: "https://github.com/…", half: true },
    { name: "image", label: "Image", kind: "url", placeholder: "https://…/cover.png" },
    { name: "isFeatured", label: "Featured", kind: "switch" },
  ],
  load: loadBackendProjects,
  save: (v, editing) => (editing ? updateProjectClient(editing.id, v) : createProjectClient(v)),
  remove: (project) => deleteProjectClient(project.id),
  toValues: (p) => ({
    title: p.title ?? "",
    description: p.description ?? "",
    content: p.content ?? "",
    projectLink: p.projectLink ?? "",
    sourceCodeLink: p.sourceCodeLink ?? "",
    image: p.image ?? "",
    isFeatured: Boolean(p.isFeatured),
  }),
  view: (p) => ({
    title: p.title,
    text: p.description,
    meta: added(p.created_at),
    status: p.isFeatured ? { word: "Featured", mark: "filled" } : undefined,
    link: p.projectLink ? { href: p.projectLink, label: "Open the project" } : null,
  }),
}

const backendWorkSchema = z.object({
  jobTitle: text("The role"),
  instance: text("The company"),
  instanceLink: optional,
  address: text("The place"),
  duration: text("The duration"),
  logo: url,
  content: text("The description", 10),
})

const loadBackendWork = async () => listOf<BackendWork>(await getWorkClient({ page: 1, limit: 50 }))

export const backendWork: CollectionProps<BackendWork, z.infer<typeof backendWorkSchema>> = {
  noun: "work entry",
  plural: "work entries",
  heading: "Legacy work experience",
  note: LEGACY_NOTE,
  schema: backendWorkSchema,
  blank: { jobTitle: "", instance: "", instanceLink: "", address: "", duration: "", logo: "", content: "" },
  fields: [
    { name: "jobTitle", label: "Role", placeholder: "Software Engineer", half: true },
    { name: "instance", label: "Company", placeholder: "Sarana AI", half: true },
    { name: "instanceLink", label: "Company site", kind: "url", placeholder: "https://…", note: "Optional.", half: true },
    { name: "address", label: "Place", placeholder: "Malang, East Java", half: true },
    { name: "duration", label: "Duration", placeholder: "January 2023 to now", half: true },
    { name: "logo", label: "Logo", kind: "url", placeholder: "https://…/logo.png", half: true },
    { name: "content", label: "Description", kind: "rich", placeholder: "The role and what came of it…" },
  ],
  load: loadBackendWork,
  save: (v, editing) => (editing ? updateWorkClient(editing.id, v) : createWorkClient(v)),
  remove: (work) => deleteWorkClient(work.id),
  toValues: (w) => ({
    jobTitle: w.jobTitle ?? "",
    instance: w.instance ?? "",
    instanceLink: w.instanceLink ?? "",
    address: w.address ?? "",
    duration: w.duration ?? "",
    logo: w.logo ?? "",
    content: w.content ?? "",
  }),
  view: (w) => ({ title: w.jobTitle, text: [w.instance, w.address].filter(Boolean).join(", "), meta: w.duration }),
}

const backendEducationSchema = z.object({
  instance: text("The institution"),
  address: text("The place"),
  duration: text("The duration"),
  logo: url,
  content: text("The description", 10),
})

const loadBackendEducation = async () => listOf<BackendEducation>(await getEducationClient({ page: 1, limit: 50 }))

export const backendEducation: CollectionProps<BackendEducation, z.infer<typeof backendEducationSchema>> = {
  noun: "education entry",
  plural: "education entries",
  heading: "Legacy education",
  note: LEGACY_NOTE,
  schema: backendEducationSchema,
  blank: { instance: "", address: "", duration: "", logo: "", content: "" },
  fields: [
    { name: "instance", label: "Institution", placeholder: "University name" },
    { name: "address", label: "Place", placeholder: "Malang, East Java", half: true },
    { name: "duration", label: "Duration", placeholder: "2019 to 2023", half: true },
    { name: "logo", label: "Logo", kind: "url", placeholder: "https://…/logo.png" },
    { name: "content", label: "Description", kind: "rich", placeholder: "The degree and what came of it…" },
  ],
  load: loadBackendEducation,
  save: (v, editing) => (editing ? updateEducationClient(editing.id, v) : createEducationClient(v)),
  remove: (education) => deleteEducationClient(education.id),
  toValues: (e) => ({ instance: e.instance ?? "", address: e.address ?? "", duration: e.duration ?? "", logo: e.logo ?? "", content: e.content ?? "" }),
  view: (e) => ({ title: e.instance, text: e.address, meta: e.duration }),
}
