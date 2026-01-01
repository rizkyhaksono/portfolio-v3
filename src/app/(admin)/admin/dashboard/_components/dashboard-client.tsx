"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart3, Briefcase, FolderKanban, GraduationCap, MessageSquare, RefreshCw, Users, Eye, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, Loader2, Database, Cloud, Server } from "lucide-react"
import {
  getProjectsClient,
  getWorkClient,
  getEducationClient,
  getCurrentUserClient,
  getPublicChatsClient,
  getSupabaseProjectsClient,
  getSupabaseCareersClient,
  getSupabaseEducationsClient,
  type BackendProject,
  type BackendWork,
  type BackendEducation,
  type SupabaseProject,
  type SupabaseCareer,
  type SupabaseEducation,
} from "@/services/admin/client-services"
import { formatDistanceToNow } from "date-fns"

interface DashboardStats {
  backend: {
    projects: number
    work: number
    education: number
    users: number
    publicChats: number
  }
  supabase: {
    projects: number
    careers: number
    educations: number
  }
}

// Helper components to avoid nested ternaries
function LoadingState() {
  return (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}

function EmptyState({ icon: Icon, message, action }: { icon: React.ElementType; message: string; action?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <Icon className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-muted-foreground">{message}</p>
      {action && (
        <Button variant="link" className="mt-2">
          {action}
        </Button>
      )}
    </div>
  )
}

function DatabaseBadge({ source }: { source: "backend" | "supabase" }) {
  return (
    <Badge variant={source === "backend" ? "default" : "secondary"} className="text-xs">
      {source === "backend" ? <Server className="h-3 w-3 mr-1" /> : <Cloud className="h-3 w-3 mr-1" />}
      {source === "backend" ? "Backend" : "Supabase"}
    </Badge>
  )
}

// Backend Projects Tab Content
function BackendProjectsTabContent({
  isLoading,
  projects,
}: Readonly<{
  isLoading: boolean
  projects: BackendProject[]
}>) {
  if (isLoading) return <LoadingState />
  if (projects.length === 0) return <EmptyState icon={FolderKanban} message="No backend projects yet" action="Create your first project" />

  return (
    <ScrollArea className="h-[300px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Source</TableHead>
            <TableHead className="text-right">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.title}</TableCell>
              <TableCell>
                <Badge variant={project.isFeatured ? "default" : "secondary"}>
                  {project.isFeatured ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                  {project.isFeatured ? "Featured" : "Normal"}
                </Badge>
              </TableCell>
              <TableCell>
                <DatabaseBadge source="backend" />
              </TableCell>
              <TableCell className="text-right text-muted-foreground">{project.created_at ? formatDistanceToNow(new Date(project.created_at), { addSuffix: true }) : "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}

// Supabase Projects Tab Content
function SupabaseProjectsTabContent({
  isLoading,
  projects,
}: Readonly<{
  isLoading: boolean
  projects: SupabaseProject[]
}>) {
  if (isLoading) return <LoadingState />
  if (projects.length === 0) return <EmptyState icon={FolderKanban} message="No Supabase projects yet" action="Create your first project" />

  return (
    <ScrollArea className="h-[300px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Source</TableHead>
            <TableHead className="text-right">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.title}</TableCell>
              <TableCell>
                {project.url ? (
                  <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Link
                  </a>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <DatabaseBadge source="supabase" />
              </TableCell>
              <TableCell className="text-right text-muted-foreground">{project.created_at ? formatDistanceToNow(new Date(project.created_at), { addSuffix: true }) : "N/A"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  )
}

// Users Tab Content
function UsersTabContent({
  isLoading,
  recentUsers,
}: Readonly<{
  isLoading: boolean
  recentUsers: any[]
}>) {
  if (isLoading) return <LoadingState />
  if (recentUsers.length === 0) return <EmptyState icon={Users} message="No users yet" />

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {recentUsers.map((user: any) => (
          <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user.avatar || user.avatarUrl} />
                <AvatarFallback>{user.name?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{user.name || "Unnamed User"}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>{user.role}</Badge>
              <DatabaseBadge source="backend" />
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

// Chats Tab Content
function ChatsTabContent({
  isLoading,
  recentChats,
}: Readonly<{
  isLoading: boolean
  recentChats: any[]
}>) {
  if (isLoading) return <LoadingState />
  if (recentChats.length === 0) return <EmptyState icon={MessageSquare} message="No chats yet" />

  return (
    <ScrollArea className="h-[300px]">
      <div className="space-y-4">
        {recentChats.map((chat: any) => (
          <div key={chat.id} className="p-3 rounded-lg border space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={chat.user?.avatar || chat.user?.avatarUrl} />
                  <AvatarFallback>{chat.user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm">{chat.user?.name || "Anonymous"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">{chat.createdAt ? formatDistanceToNow(new Date(chat.createdAt), { addSuffix: true }) : "N/A"}</span>
                <DatabaseBadge source="backend" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{chat.message}</p>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}

// Work/Career comparison tab
function WorkCareerTabContent({
  isLoading,
  backendWork,
  supabaseCareers,
}: Readonly<{
  isLoading: boolean
  backendWork: BackendWork[]
  supabaseCareers: SupabaseCareer[]
}>) {
  if (isLoading) return <LoadingState />

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Backend Work */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Server className="h-4 w-4" />
            Backend Work Experience
          </CardTitle>
          <CardDescription>{backendWork.length} entries</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {backendWork.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No work entries</p>
            ) : (
              <div className="space-y-3">
                {backendWork.map((work) => (
                  <div key={work.id} className="p-2 rounded border">
                    <p className="font-medium text-sm">{work.jobTitle}</p>
                    <p className="text-xs text-muted-foreground">{work.instance}</p>
                    <p className="text-xs text-muted-foreground">{work.duration}</p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Supabase Careers */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            Supabase Careers
          </CardTitle>
          <CardDescription>{supabaseCareers.length} entries</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {supabaseCareers.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No career entries</p>
            ) : (
              <div className="space-y-3">
                {supabaseCareers.map((career) => (
                  <div key={career.id} className="p-2 rounded border">
                    <p className="font-medium text-sm">{career.title}</p>
                    <p className="text-xs text-muted-foreground">{career.subtitle}</p>
                    <p className="text-xs text-muted-foreground">{career.duration}</p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

// Education comparison tab
function EducationTabContent({
  isLoading,
  backendEducation,
  supabaseEducations,
}: Readonly<{
  isLoading: boolean
  backendEducation: BackendEducation[]
  supabaseEducations: SupabaseEducation[]
}>) {
  if (isLoading) return <LoadingState />

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Backend Education */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Server className="h-4 w-4" />
            Backend Education
          </CardTitle>
          <CardDescription>{backendEducation.length} entries</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {backendEducation.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No education entries</p>
            ) : (
              <div className="space-y-3">
                {backendEducation.map((edu) => (
                  <div key={edu.id} className="p-2 rounded border">
                    <p className="font-medium text-sm">{edu.instance}</p>
                    <p className="text-xs text-muted-foreground">{edu.address}</p>
                    <p className="text-xs text-muted-foreground">{edu.duration}</p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Supabase Education */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            Supabase Education
          </CardTitle>
          <CardDescription>{supabaseEducations.length} entries</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            {supabaseEducations.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No education entries</p>
            ) : (
              <div className="space-y-3">
                {supabaseEducations.map((edu) => (
                  <div key={edu.id} className="p-2 rounded border">
                    <p className="font-medium text-sm">{edu.title}</p>
                    <p className="text-xs text-muted-foreground">{edu.subtitle}</p>
                    <p className="text-xs text-muted-foreground">{edu.duration}</p>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

export function AdminDashboardClient() {
  const [stats, setStats] = useState<DashboardStats>({
    backend: { projects: 0, work: 0, education: 0, users: 0, publicChats: 0 },
    supabase: { projects: 0, careers: 0, educations: 0 },
  })

  // Backend data
  const [backendProjects, setBackendProjects] = useState<BackendProject[]>([])
  const [backendWork, setBackendWork] = useState<BackendWork[]>([])
  const [backendEducation, setBackendEducation] = useState<BackendEducation[]>([])
  const [recentChats, setRecentChats] = useState<any[]>([])
  const [recentUsers, setRecentUsers] = useState<any[]>([])

  // Supabase data
  const [supabaseProjects, setSupabaseProjects] = useState<SupabaseProject[]>([])
  const [supabaseCareers, setSupabaseCareers] = useState<SupabaseCareer[]>([])
  const [supabaseEducations, setSupabaseEducations] = useState<SupabaseEducation[]>([])

  const [isLoading, setIsLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      // Fetch Backend API data
      const [projectsRes, worksRes, educationRes, currentUserRes, chatsRes] = await Promise.all([
        getProjectsClient({ page: 1, limit: 10 }).catch(() => ({ data: [] })),
        getWorkClient({ page: 1, limit: 10 }).catch(() => ({ data: [] })),
        getEducationClient({ page: 1, limit: 10 }).catch(() => ({ data: [] })),
        getCurrentUserClient().catch(() => null),
        getPublicChatsClient(undefined, 10).catch(() => ({ data: [] })),
      ])

      // Fetch Supabase data
      const [sbProjects, sbCareers, sbEducations] = await Promise.all([getSupabaseProjectsClient().catch(() => []), getSupabaseCareersClient().catch(() => []), getSupabaseEducationsClient().catch(() => [])])

      // Set backend data
      const projects = projectsRes.data || []
      const works = worksRes.data || []
      const education = educationRes.data || []
      const currentUser = currentUserRes
      const chats = chatsRes.data || []

      setBackendProjects(projects)
      setBackendWork(works)
      setBackendEducation(education)
      setRecentChats(chats.slice(0, 5))
      setRecentUsers(currentUser ? [currentUser] : [])

      // Set Supabase data
      setSupabaseProjects(sbProjects)
      setSupabaseCareers(sbCareers)
      setSupabaseEducations(sbEducations)

      // Update stats
      setStats({
        backend: {
          projects: projects.length,
          work: works.length,
          education: education.length,
          users: currentUser ? 1 : 0,
          publicChats: chats.length,
        },
        supabase: {
          projects: sbProjects.length,
          careers: sbCareers.length,
          educations: sbEducations.length,
        },
      })

      setLastRefresh(new Date())
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Stats cards configuration
  const backendStatsCards = [
    {
      title: "Backend Projects",
      value: stats.backend.projects,
      description: "From personal API",
      icon: FolderKanban,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      source: "backend" as const,
    },
    {
      title: "Work Experience",
      value: stats.backend.work,
      description: "Job entries",
      icon: Briefcase,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      source: "backend" as const,
    },
    {
      title: "Education",
      value: stats.backend.education,
      description: "Education records",
      icon: GraduationCap,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
      source: "backend" as const,
    },
    {
      title: "Public Chats",
      value: stats.backend.publicChats,
      description: "Chat messages",
      icon: MessageSquare,
      color: "text-pink-600",
      bgColor: "bg-pink-100 dark:bg-pink-900/30",
      source: "backend" as const,
    },
  ]

  const supabaseStatsCards = [
    {
      title: "Supabase Projects",
      value: stats.supabase.projects,
      description: "From Supabase DB",
      icon: FolderKanban,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
      source: "supabase" as const,
    },
    {
      title: "Careers",
      value: stats.supabase.careers,
      description: "Career entries",
      icon: Briefcase,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
      source: "supabase" as const,
    },
    {
      title: "Education",
      value: stats.supabase.educations,
      description: "Education records",
      icon: GraduationCap,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
      source: "supabase" as const,
    },
  ]

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of both Backend API and Supabase databases.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Last updated: {formatDistanceToNow(lastRefresh, { addSuffix: true })}</span>
          <Button variant="outline" size="sm" onClick={fetchDashboardData} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            <span className="ml-2 hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Database Status */}
      <div className="flex gap-4 flex-wrap">
        <Badge variant="outline" className="text-sm py-1 px-3">
          <Server className="h-4 w-4 mr-2 text-green-600" />
          Backend API Connected
        </Badge>
        <Badge variant="outline" className="text-sm py-1 px-3">
          <Cloud className="h-4 w-4 mr-2 text-blue-600" />
          Supabase Connected
        </Badge>
      </div>

      {/* Backend Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Server className="h-5 w-5" />
          Backend API (Prisma)
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {backendStatsCards.map((stat) => (
            <Card key={stat.title} className="relative overflow-hidden border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold">{isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stat.value}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Supabase Stats */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Cloud className="h-5 w-5" />
          Supabase Database
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {supabaseStatsCards.map((stat) => (
            <Card key={stat.title} className="relative overflow-hidden border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold">{isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : stat.value}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="backend-projects" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 lg:w-auto">
          <TabsTrigger value="backend-projects" className="gap-2">
            <Server className="h-4 w-4" />
            <span className="hidden sm:inline">Backend Projects</span>
          </TabsTrigger>
          <TabsTrigger value="supabase-projects" className="gap-2">
            <Cloud className="h-4 w-4" />
            <span className="hidden sm:inline">Supabase Projects</span>
          </TabsTrigger>
          <TabsTrigger value="work-career" className="gap-2">
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">Work/Career</span>
          </TabsTrigger>
          <TabsTrigger value="education" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            <span className="hidden sm:inline">Education</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="chats" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Chats</span>
          </TabsTrigger>
        </TabsList>

        {/* Backend Projects Tab */}
        <TabsContent value="backend-projects">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Backend Projects
              </CardTitle>
              <CardDescription>Projects stored in your personal Backend API (Prisma database).</CardDescription>
            </CardHeader>
            <CardContent>
              <BackendProjectsTabContent isLoading={isLoading} projects={backendProjects} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Supabase Projects Tab */}
        <TabsContent value="supabase-projects">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cloud className="h-5 w-5" />
                Supabase Projects
              </CardTitle>
              <CardDescription>Projects stored in your Supabase database.</CardDescription>
            </CardHeader>
            <CardContent>
              <SupabaseProjectsTabContent isLoading={isLoading} projects={supabaseProjects} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Work/Career Comparison Tab */}
        <TabsContent value="work-career">
          <WorkCareerTabContent isLoading={isLoading} backendWork={backendWork} supabaseCareers={supabaseCareers} />
        </TabsContent>

        {/* Education Comparison Tab */}
        <TabsContent value="education">
          <EducationTabContent isLoading={isLoading} backendEducation={backendEducation} supabaseEducations={supabaseEducations} />
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Users (Backend)</CardTitle>
              <CardDescription>Users registered in your Backend API.</CardDescription>
            </CardHeader>
            <CardContent>
              <UsersTabContent isLoading={isLoading} recentUsers={recentUsers} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Chats Tab */}
        <TabsContent value="chats">
          <Card>
            <CardHeader>
              <CardTitle>Public Chats (Backend)</CardTitle>
              <CardDescription>Recent public chat messages.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChatsTabContent isLoading={isLoading} recentChats={recentChats} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage both databases from here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <a href="/admin/dashboard/project">
                <FolderKanban className="h-5 w-5" />
                <span>Manage Projects</span>
                <span className="text-xs text-muted-foreground">Both DBs</span>
              </a>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <a href="/admin/dashboard/work">
                <Briefcase className="h-5 w-5" />
                <span>Manage Work</span>
                <span className="text-xs text-muted-foreground">Both DBs</span>
              </a>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <a href="/admin/dashboard/education">
                <GraduationCap className="h-5 w-5" />
                <span>Manage Education</span>
                <span className="text-xs text-muted-foreground">Both DBs</span>
              </a>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <a href="/admin/dashboard/career">
                <Briefcase className="h-5 w-5" />
                <span>Manage Career</span>
                <span className="text-xs text-muted-foreground">Supabase</span>
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
