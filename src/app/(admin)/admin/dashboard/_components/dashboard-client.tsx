"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Cloud, Database, RefreshCw } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/ui/eyebrow"
import { StatStrip } from "@/components/ui/stat-strip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  getProjectsClient,
  getSupabaseProjectsClient,
  getSupabaseCareersClient,
  getSupabaseEducationsClient,
  type BackendProject,
  type SupabaseProject,
  type SupabaseCareer,
  type SupabaseEducation,
} from "@/services/admin/client-services"

const PAGE_SIZE = 10

interface DashboardData {
  supabaseProjects: SupabaseProject[]
  supabaseCareers: SupabaseCareer[]
  supabaseEducations: SupabaseEducation[]
  backendProjects: BackendProject[]
}

interface PaginationProps {
  page: number
  total: number
  onPageChange: (page: number) => void
}

/** Returns one page from an in-memory admin dataset. */
function paginate<T>(items: T[], page: number): T[] {
  const start = (page - 1) * PAGE_SIZE
  return items.slice(start, start + PAGE_SIZE)
}

/** Provides compact pagination with a fixed ten-row page size. */
function Pagination({ page, total, onPageChange }: Readonly<PaginationProps>) {
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const firstItem = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const lastItem = Math.min(page * PAGE_SIZE, total)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
      <p className="text-xs text-muted-foreground">
        {firstItem}–{lastItem} of {total} · {PAGE_SIZE} per page
      </p>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </Button>
        <span className="min-w-16 text-center text-xs tabular-nums">{page} / {totalPages}</span>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  )
}

/** Formats database timestamps consistently for the compact tables. */
function formatDate(value: string | null | undefined): string {
  if (!value) return "—"
  return new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value))
}

/** Displays a lightweight loading state without animated spinners. */
function LoadingRows() {
  return (
    <div className="border-y border-border py-12 text-center text-sm text-muted-foreground">
      Loading data…
    </div>
  )
}

/** Displays a concise empty-state message for database tables. */
function EmptyRows({ label }: Readonly<{ label: string }>) {
  return (
    <div className="border-y border-border py-12 text-center text-sm text-muted-foreground">
      No {label.toLowerCase()} found.
    </div>
  )
}

/** Renders Supabase project rows. */
function SupabaseProjectsTable({ items }: Readonly<{ items: SupabaseProject[] }>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead className="hidden md:table-cell">Description</TableHead>
          <TableHead>Link</TableHead>
          <TableHead className="text-right">Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((project) => (
          <TableRow key={project.id}>
            <TableCell className="font-medium">{project.title}</TableCell>
            <TableCell className="hidden max-w-md truncate text-muted-foreground md:table-cell">{project.description}</TableCell>
            <TableCell>
              {project.url ? <a href={project.url} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">Open</a> : "—"}
            </TableCell>
            <TableCell className="text-right text-muted-foreground">{formatDate(project.created_at)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

/** Renders Supabase career rows. */
function CareersTable({ items }: Readonly<{ items: SupabaseCareer[] }>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Role</TableHead>
          <TableHead>Company</TableHead>
          <TableHead className="text-right">Duration</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((career) => (
          <TableRow key={career.id}>
            <TableCell className="font-medium">{career.title}</TableCell>
            <TableCell className="text-muted-foreground">{career.subtitle}</TableCell>
            <TableCell className="text-right font-mono text-xs">{career.duration}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

/** Renders Supabase education rows. */
function EducationTable({ items }: Readonly<{ items: SupabaseEducation[] }>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Education</TableHead>
          <TableHead>Program</TableHead>
          <TableHead className="text-right">Duration</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((education) => (
          <TableRow key={education.id}>
            <TableCell className="font-medium">{education.title}</TableCell>
            <TableCell className="text-muted-foreground">{education.subtitle}</TableCell>
            <TableCell className="text-right font-mono text-xs">{education.duration}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

/** Renders legacy backend project rows for comparison. */
function BackendProjectsTable({ items }: Readonly<{ items: BackendProject[] }>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead className="hidden md:table-cell">Description</TableHead>
          <TableHead>Featured</TableHead>
          <TableHead className="text-right">Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((project) => (
          <TableRow key={project.id}>
            <TableCell className="font-medium">{project.title}</TableCell>
            <TableCell className="hidden max-w-md truncate text-muted-foreground md:table-cell">{project.description}</TableCell>
            <TableCell>{project.isFeatured ? "Yes" : "No"}</TableCell>
            <TableCell className="text-right text-muted-foreground">{formatDate(project.created_at)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

interface DataTabProps<T> {
  label: string
  description: string
  items: T[]
  page: number
  isLoading: boolean
  onPageChange: (page: number) => void
  renderTable: (items: T[]) => React.ReactNode
}

/** Composes a table, empty state, and its pagination controls. */
function DataTab<T>({
  label,
  description,
  items,
  page,
  isLoading,
  onPageChange,
  renderTable,
}: Readonly<DataTabProps<T>>) {
  const visibleItems = useMemo(() => paginate(items, page), [items, page])

  let content: React.ReactNode
  if (isLoading) content = <LoadingRows />
  else if (items.length === 0) content = <EmptyRows label={label} />
  else content = renderTable(visibleItems)

  return (
    <section className="border-y border-border py-5">
      <div className="mb-4">
        <h2 className="font-display text-lg font-semibold">{label}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="overflow-x-auto">{content}</div>
      {!isLoading && items.length > 0 ? (
        <Pagination page={page} total={items.length} onPageChange={onPageChange} />
      ) : null}
    </section>
  )
}

/** Loads and presents the admin overview in the portfolio's editorial language. */
export function AdminDashboardClient() {
  const [data, setData] = useState<DashboardData>({
    supabaseProjects: [],
    supabaseCareers: [],
    supabaseEducations: [],
    backendProjects: [],
  })
  const [pages, setPages] = useState<Record<string, number>>({
    projects: 1,
    careers: 1,
    education: 1,
    backend: 1,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true)
    const [supabaseProjects, supabaseCareers, supabaseEducations, backendResponse] = await Promise.all([
      getSupabaseProjectsClient().catch(() => []),
      getSupabaseCareersClient().catch(() => []),
      getSupabaseEducationsClient().catch(() => []),
      getProjectsClient({ page: 1, limit: 100 }).catch(() => ({ data: [] })),
    ])

    setData({
      supabaseProjects,
      supabaseCareers,
      supabaseEducations,
      backendProjects: backendResponse.data ?? [],
    })
    setPages({ projects: 1, careers: 1, education: 1, backend: 1 })
    setLastRefresh(new Date())
    setIsLoading(false)
  }, [])

  useEffect(() => {
    void fetchDashboardData()
  }, [fetchDashboardData])

  const updatePage = (key: string, page: number) => {
    setPages((current) => ({ ...current, [key]: page }))
  }

  const overviewItems = [
    { label: "Supabase projects", value: data.supabaseProjects.length },
    { label: "Careers", value: data.supabaseCareers.length },
    { label: "Education", value: data.supabaseEducations.length },
    { label: "Backend projects", value: data.backendProjects.length },
  ]

  return (
    <div className="mx-auto w-full max-w-6xl py-4 sm:py-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Content</Eyebrow>
          <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">Portfolio data</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Supabase is the primary source. Legacy backend data remains available for comparison.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh ? (
            <span className="hidden text-xs text-muted-foreground sm:inline">
              Updated {formatDistanceToNow(lastRefresh, { addSuffix: true })}
            </span>
          ) : null}
          <Button variant="outline" size="sm" onClick={() => void fetchDashboardData()} disabled={isLoading}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        </div>
      </div>

      <StatStrip items={overviewItems} className="mb-8 border-x-0" />

      <Tabs defaultValue="supabase-projects">
        <TabsList className="h-auto w-full justify-start overflow-x-auto border-y border-border bg-transparent p-0">
          <TabsTrigger value="supabase-projects" className="gap-2 border-r border-border px-4 py-3 data-[state=active]:bg-secondary">
            <Cloud className="h-4 w-4" /> Supabase projects
          </TabsTrigger>
          <TabsTrigger value="careers" className="border-r border-border px-4 py-3 data-[state=active]:bg-secondary">Careers</TabsTrigger>
          <TabsTrigger value="education" className="border-r border-border px-4 py-3 data-[state=active]:bg-secondary">Education</TabsTrigger>
          <TabsTrigger value="backend-projects" className="gap-2 px-4 py-3 data-[state=active]:bg-secondary">
            <Database className="h-4 w-4" /> Backend
          </TabsTrigger>
        </TabsList>

        <TabsContent value="supabase-projects">
          <DataTab
            label="Supabase projects"
            description="Primary project records from Supabase."
            items={data.supabaseProjects}
            page={pages.projects}
            isLoading={isLoading}
            onPageChange={(page) => updatePage("projects", page)}
            renderTable={(items) => <SupabaseProjectsTable items={items} />}
          />
        </TabsContent>
        <TabsContent value="careers">
          <DataTab
            label="Careers"
            description="Work history published on the portfolio."
            items={data.supabaseCareers}
            page={pages.careers}
            isLoading={isLoading}
            onPageChange={(page) => updatePage("careers", page)}
            renderTable={(items) => <CareersTable items={items} />}
          />
        </TabsContent>
        <TabsContent value="education">
          <DataTab
            label="Education"
            description="Education and training records from Supabase."
            items={data.supabaseEducations}
            page={pages.education}
            isLoading={isLoading}
            onPageChange={(page) => updatePage("education", page)}
            renderTable={(items) => <EducationTable items={items} />}
          />
        </TabsContent>
        <TabsContent value="backend-projects">
          <DataTab
            label="Backend projects"
            description="Legacy Prisma project records."
            items={data.backendProjects}
            page={pages.backend}
            isLoading={isLoading}
            onPageChange={(page) => updatePage("backend", page)}
            renderTable={(items) => <BackendProjectsTable items={items} />}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
