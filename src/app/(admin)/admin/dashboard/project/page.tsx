"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FolderGit2, Loader2, Pencil, Plus, Trash, Server, Cloud, ExternalLink } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import Link from "next/link"
import {
  getProjectsClient,
  createProjectClient,
  updateProjectClient,
  deleteProjectClient,
  getSupabaseProjectsClient,
  createSupabaseProjectClient,
  updateSupabaseProjectClient,
  deleteSupabaseProjectClient,
  type BackendProject,
  type SupabaseProject,
} from "@/services/admin/client-services"

// Backend Project Form Schema
const backendFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  projectLink: z.string().default(""),
  sourceCodeLink: z.string().optional(),
  image: z.string().url("Must be a valid URL"),
  isFeatured: z.boolean().default(false),
})

// Supabase Project Form Schema
const supabaseFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  url: z.string().nullable().optional(),
  source_code: z.string().nullable().optional(),
  image: z.string().nullable().optional(),
})

type DataSource = "backend" | "supabase"

export default function AdminProjectPage() {
  // Backend state
  const [backendData, setBackendData] = useState<BackendProject[]>([])
  const [editingBackend, setEditingBackend] = useState<BackendProject | null>(null)
  const [isBackendDialogOpen, setIsBackendDialogOpen] = useState(false)

  // Supabase state
  const [supabaseData, setSupabaseData] = useState<SupabaseProject[]>([])
  const [editingSupabase, setEditingSupabase] = useState<SupabaseProject | null>(null)
  const [isSupabaseDialogOpen, setIsSupabaseDialogOpen] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<DataSource>("backend")

  // Backend form
  const backendForm = useForm<z.infer<typeof backendFormSchema>>({
    resolver: zodResolver(backendFormSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      projectLink: "",
      sourceCodeLink: "",
      image: "",
      isFeatured: false,
    },
  })

  // Supabase form
  const supabaseForm = useForm<z.infer<typeof supabaseFormSchema>>({
    resolver: zodResolver(supabaseFormSchema),
    defaultValues: {
      title: "",
      description: "",
      url: null,
      source_code: null,
      image: null,
    },
  })

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [backendRes, supabaseRes] = await Promise.all([getProjectsClient({ page: 1, limit: 50 }).catch(() => ({ data: [] })), getSupabaseProjectsClient().catch(() => [])])
      setBackendData(backendRes.data || [])
      setSupabaseData(supabaseRes)
    } catch (error) {
      console.error("Failed to fetch data:", error)
      toast.error("Failed to load data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Backend CRUD handlers
  async function onBackendSubmit(values: z.infer<typeof backendFormSchema>) {
    setIsSubmitting(true)
    try {
      const payload = {
        title: values.title,
        description: values.description,
        content: values.content,
        projectLink: values.projectLink || "",
        sourceCodeLink: values.sourceCodeLink,
        image: values.image,
        isFeatured: values.isFeatured || false,
      }
      if (editingBackend) {
        await updateProjectClient(editingBackend.id, payload)
        toast.success("Project updated!")
      } else {
        await createProjectClient(payload)
        toast.success("Project created!")
      }
      setIsBackendDialogOpen(false)
      backendForm.reset()
      setEditingBackend(null)
      fetchData()
    } catch (error) {
      console.error("Failed to save:", error)
      toast.error("Failed to save project")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleBackendDelete(id: string) {
    try {
      await deleteProjectClient(id)
      toast.success("Project deleted!")
      fetchData()
    } catch (error) {
      console.error("Delete failed:", error)
      toast.error("Failed to delete project")
    }
  }

  function handleBackendEdit(project: BackendProject) {
    setEditingBackend(project)
    backendForm.reset({
      title: project.title || "",
      description: project.description || "",
      content: project.content || "",
      projectLink: project.projectLink || "",
      sourceCodeLink: project.sourceCodeLink || "",
      image: project.image || "",
      isFeatured: project.isFeatured || false,
    })
    setIsBackendDialogOpen(true)
  }

  // Supabase CRUD handlers
  async function onSupabaseSubmit(values: z.infer<typeof supabaseFormSchema>) {
    setIsSubmitting(true)
    try {
      const payload = {
        title: values.title,
        description: values.description,
        url: values.url ?? null,
        source_code: values.source_code ?? null,
        image: values.image ?? null,
      }
      if (editingSupabase) {
        await updateSupabaseProjectClient(editingSupabase.id, payload)
        toast.success("Project updated!")
      } else {
        await createSupabaseProjectClient(payload)
        toast.success("Project created!")
      }
      setIsSupabaseDialogOpen(false)
      supabaseForm.reset()
      setEditingSupabase(null)
      fetchData()
    } catch (error) {
      console.error("Failed to save:", error)
      toast.error("Failed to save project")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSupabaseDelete(id: string) {
    try {
      await deleteSupabaseProjectClient(id)
      toast.success("Project deleted!")
      fetchData()
    } catch (error) {
      console.error("Delete failed:", error)
      toast.error("Failed to delete project")
    }
  }

  function handleSupabaseEdit(project: SupabaseProject) {
    setEditingSupabase(project)
    supabaseForm.reset({
      title: project.title || "",
      description: project.description || "",
      url: project.url,
      source_code: project.source_code,
      image: project.image,
    })
    setIsSupabaseDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Database summary */}
      <div className="flex gap-4 flex-wrap">
        <Badge variant="outline" className="text-sm py-1 px-3">
          <Server className="h-4 w-4 mr-2" />
          Backend: {backendData.length} projects
        </Badge>
        <Badge variant="outline" className="text-sm py-1 px-3">
          <Cloud className="h-4 w-4 mr-2" />
          Supabase: {supabaseData.length} projects
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DataSource)}>
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="backend" className="gap-2">
            <Server className="h-4 w-4" />
            Backend Projects
          </TabsTrigger>
          <TabsTrigger value="supabase" className="gap-2">
            <Cloud className="h-4 w-4" />
            Supabase Projects
          </TabsTrigger>
        </TabsList>

        {/* Backend Projects Tab */}
        <TabsContent value="backend">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Backend Projects
                </CardTitle>
                <CardDescription>{backendData.length} total projects in Prisma database</CardDescription>
              </div>
              <Dialog open={isBackendDialogOpen} onOpenChange={setIsBackendDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingBackend(null)
                      backendForm.reset()
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingBackend ? "Edit Project" : "Add Project"}</DialogTitle>
                    <DialogDescription>{editingBackend ? "Update the project in Backend API." : "Add new project to Backend API."}</DialogDescription>
                  </DialogHeader>
                  <Form {...backendForm}>
                    <form onSubmit={backendForm.handleSubmit(onBackendSubmit)} className="space-y-4">
                      <FormField
                        control={backendForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Project Title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={backendForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Brief description..." className="min-h-[80px]" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={backendForm.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                              <RichTextEditor content={field.value} onChange={field.onChange} placeholder="Detailed project content..." />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={backendForm.control}
                          name="projectLink"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Project URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://demo.example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={backendForm.control}
                          name="sourceCodeLink"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Source Code URL</FormLabel>
                              <FormControl>
                                <Input placeholder="https://github.com/..." {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={backendForm.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/image.png" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsBackendDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {editingBackend ? "Update" : "Create"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {backendData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FolderGit2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No projects in Backend</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead className="hidden sm:table-cell">Featured</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backendData.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">{project.title}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell max-w-[200px] truncate">{project.description}</TableCell>
                        <TableCell className="hidden sm:table-cell">{project.isFeatured && <Badge variant="secondary">Featured</Badge>}</TableCell>
                        <TableCell className="text-right space-x-2">
                          {project.projectLink && (
                            <Button variant="ghost" size="icon" asChild>
                              <Link href={project.projectLink} target="_blank">
                                <ExternalLink className="h-4 w-4" />
                              </Link>
                            </Button>
                          )}
                          <Button variant="outline" size="icon" onClick={() => handleBackendEdit(project)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                                <AlertDialogDescription>This will delete "{project.title}".</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleBackendDelete(project.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Supabase Projects Tab */}
        <TabsContent value="supabase">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Supabase Projects
                </CardTitle>
                <CardDescription>{supabaseData.length} total projects in Supabase database</CardDescription>
              </div>
              <Dialog open={isSupabaseDialogOpen} onOpenChange={setIsSupabaseDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      setEditingSupabase(null)
                      supabaseForm.reset()
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingSupabase ? "Edit Project" : "Add Project"}</DialogTitle>
                    <DialogDescription>{editingSupabase ? "Update the project in Supabase." : "Add new project to Supabase."}</DialogDescription>
                  </DialogHeader>
                  <Form {...supabaseForm}>
                    <form onSubmit={supabaseForm.handleSubmit(onSupabaseSubmit)} className="space-y-4">
                      <FormField
                        control={supabaseForm.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Project Title" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={supabaseForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <RichTextEditor content={field.value} onChange={field.onChange} placeholder="Project description…" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={supabaseForm.control}
                        name="url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com" {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={supabaseForm.control}
                        name="source_code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Source Code URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://github.com/..." {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={supabaseForm.control}
                        name="image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/image.png" {...field} value={field.value || ""} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsSupabaseDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {editingSupabase ? "Update" : "Create"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {supabaseData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FolderGit2 className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No projects in Supabase</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden md:table-cell">Description</TableHead>
                      <TableHead className="hidden sm:table-cell">URL</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supabaseData.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.title}</TableCell>
                        <TableCell className="hidden md:table-cell max-w-[200px] truncate">{project.description}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {project.url ? (
                            <Link href={project.url} target="_blank" className="text-blue-600 hover:underline flex items-center gap-1">
                              Visit <ExternalLink className="h-3 w-3" />
                            </Link>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleSupabaseEdit(project)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon">
                                <Trash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Project?</AlertDialogTitle>
                                <AlertDialogDescription>This will delete "{project.title}".</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleSupabaseDelete(project.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
