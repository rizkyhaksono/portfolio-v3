"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Briefcase, Loader2, Pencil, Plus, Trash, Server, Cloud } from "lucide-react"
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
import {
  getWorkClient,
  createWorkClient,
  updateWorkClient,
  deleteWorkClient,
  getSupabaseCareersClient,
  createSupabaseCareerClient,
  updateSupabaseCareerClient,
  deleteSupabaseCareerClient,
  type BackendWork,
  type SupabaseCareer,
} from "@/services/admin/client-services"

// Backend Work Form Schema
const backendFormSchema = z.object({
  logo: z.string().url("Must be a valid URL"),
  jobTitle: z.string().min(2, "Job title must be at least 2 characters"),
  instance: z.string().min(2, "Company name must be at least 2 characters"),
  instanceLink: z.string().default(""),
  address: z.string().min(2, "Address must be at least 2 characters"),
  duration: z.string().min(2, "Duration must be at least 2 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
})

// Supabase Career Form Schema
const supabaseFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  subtitle: z.string().min(2, "Subtitle must be at least 2 characters"),
  duration: z.string().min(2, "Duration must be at least 2 characters"),
  image: z.string().nullable().optional(),
})

type DataSource = "backend" | "supabase"

export default function AdminWorkPage() {
  // Backend state
  const [backendData, setBackendData] = useState<BackendWork[]>([])
  const [editingBackend, setEditingBackend] = useState<BackendWork | null>(null)
  const [isBackendDialogOpen, setIsBackendDialogOpen] = useState(false)

  // Supabase state
  const [supabaseData, setSupabaseData] = useState<SupabaseCareer[]>([])
  const [editingSupabase, setEditingSupabase] = useState<SupabaseCareer | null>(null)
  const [isSupabaseDialogOpen, setIsSupabaseDialogOpen] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<DataSource>("backend")

  // Backend form
  const backendForm = useForm<z.infer<typeof backendFormSchema>>({
    resolver: zodResolver(backendFormSchema),
    defaultValues: {
      logo: "",
      jobTitle: "",
      instance: "",
      instanceLink: "",
      address: "",
      duration: "",
      content: "",
    },
  })

  // Supabase form
  const supabaseForm = useForm<z.infer<typeof supabaseFormSchema>>({
    resolver: zodResolver(supabaseFormSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      duration: "",
      image: "",
    },
  })

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [backendRes, supabaseRes] = await Promise.all([getWorkClient({ page: 1, limit: 50 }).catch(() => ({ data: [] })), getSupabaseCareersClient().catch(() => [])])
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
        logo: values.logo,
        jobTitle: values.jobTitle,
        instance: values.instance,
        instanceLink: values.instanceLink || "",
        address: values.address,
        duration: values.duration,
        content: values.content,
      }
      if (editingBackend) {
        await updateWorkClient(editingBackend.id, payload)
        toast.success("Work experience updated!")
      } else {
        await createWorkClient(payload)
        toast.success("Work experience created!")
      }
      setIsBackendDialogOpen(false)
      backendForm.reset()
      setEditingBackend(null)
      fetchData()
    } catch (error) {
      console.error("Failed to save:", error)
      toast.error("Failed to save work experience")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleBackendDelete(id: string) {
    try {
      await deleteWorkClient(id)
      toast.success("Work experience deleted!")
      fetchData()
    } catch (error) {
      console.error("Delete failed:", error)
      toast.error("Failed to delete work experience")
    }
  }

  function handleBackendEdit(work: BackendWork) {
    setEditingBackend(work)
    backendForm.reset({
      logo: work.logo || "",
      jobTitle: work.jobTitle || "",
      instance: work.instance || "",
      instanceLink: work.instanceLink || "",
      address: work.address || "",
      duration: work.duration || "",
      content: work.content || "",
    })
    setIsBackendDialogOpen(true)
  }

  // Supabase CRUD handlers
  async function onSupabaseSubmit(values: z.infer<typeof supabaseFormSchema>) {
    setIsSubmitting(true)
    try {
      const payload = {
        title: values.title,
        subtitle: values.subtitle,
        duration: values.duration,
        image: values.image ?? null,
      }
      if (editingSupabase) {
        await updateSupabaseCareerClient(editingSupabase.id, payload)
        toast.success("Career updated!")
      } else {
        await createSupabaseCareerClient(payload)
        toast.success("Career created!")
      }
      setIsSupabaseDialogOpen(false)
      supabaseForm.reset()
      setEditingSupabase(null)
      fetchData()
    } catch (error) {
      console.error("Failed to save:", error)
      toast.error("Failed to save career")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSupabaseDelete(id: string) {
    try {
      await deleteSupabaseCareerClient(id)
      toast.success("Career deleted!")
      fetchData()
    } catch (error) {
      console.error("Delete failed:", error)
      toast.error("Failed to delete career")
    }
  }

  function handleSupabaseEdit(career: SupabaseCareer) {
    setEditingSupabase(career)
    supabaseForm.reset({
      title: career.title || "",
      subtitle: career.subtitle || "",
      duration: career.duration || "",
      image: career.image || "",
    })
    setIsSupabaseDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Briefcase className="h-8 w-8" />
            Work & Career
          </h1>
          <p className="text-muted-foreground">Manage work experience from both databases</p>
        </div>
      </div>

      {/* Database summary */}
      <div className="flex gap-4 flex-wrap">
        <Badge variant="outline" className="text-sm py-1 px-3">
          <Server className="h-4 w-4 mr-2" />
          Backend: {backendData.length} entries
        </Badge>
        <Badge variant="outline" className="text-sm py-1 px-3">
          <Cloud className="h-4 w-4 mr-2" />
          Supabase: {supabaseData.length} entries
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as DataSource)}>
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="backend" className="gap-2">
            <Server className="h-4 w-4" />
            Backend Work
          </TabsTrigger>
          <TabsTrigger value="supabase" className="gap-2">
            <Cloud className="h-4 w-4" />
            Supabase Career
          </TabsTrigger>
        </TabsList>

        {/* Backend Work Tab */}
        <TabsContent value="backend">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Backend Work Experience
                </CardTitle>
                <CardDescription>{backendData.length} total entries in Prisma database</CardDescription>
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
                    Add Work
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingBackend ? "Edit Work Experience" : "Add Work Experience"}</DialogTitle>
                    <DialogDescription>{editingBackend ? "Update the work experience in Backend API." : "Add new work experience to Backend API."}</DialogDescription>
                  </DialogHeader>
                  <Form {...backendForm}>
                    <form onSubmit={backendForm.handleSubmit(onBackendSubmit)} className="space-y-4">
                      <FormField
                        control={backendForm.control}
                        name="logo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Logo URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/logo.png" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={backendForm.control}
                        name="jobTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Software Engineer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={backendForm.control}
                        name="instance"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Acme Corp" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={backendForm.control}
                        name="instanceLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Website (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="https://acme.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={backendForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="San Francisco, CA" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={backendForm.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration</FormLabel>
                            <FormControl>
                              <Input placeholder="Jan 2023 - Present" {...field} />
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
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <RichTextEditor content={field.value} onChange={field.onChange} placeholder="Describe your role and responsibilities..." />
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
                  <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No work experience in Backend</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead className="hidden md:table-cell">Location</TableHead>
                      <TableHead className="hidden sm:table-cell">Duration</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backendData.map((work) => (
                      <TableRow key={work.id}>
                        <TableCell className="font-medium">{work.jobTitle}</TableCell>
                        <TableCell>{work.instance}</TableCell>
                        <TableCell className="hidden md:table-cell">{work.address}</TableCell>
                        <TableCell className="hidden sm:table-cell">{work.duration}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleBackendEdit(work)}>
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
                                <AlertDialogTitle>Delete Work Experience?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will delete "{work.jobTitle}" at "{work.instance}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleBackendDelete(work.id)}>Delete</AlertDialogAction>
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

        {/* Supabase Career Tab */}
        <TabsContent value="supabase">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Supabase Career
                </CardTitle>
                <CardDescription>{supabaseData.length} total entries in Supabase database</CardDescription>
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
                    Add Career
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>{editingSupabase ? "Edit Career" : "Add Career"}</DialogTitle>
                    <DialogDescription>{editingSupabase ? "Update the career in Supabase." : "Add new career to Supabase."}</DialogDescription>
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
                              <Input placeholder="Software Engineer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={supabaseForm.control}
                        name="subtitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subtitle / Company</FormLabel>
                            <FormControl>
                              <Input placeholder="Acme Corp" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={supabaseForm.control}
                        name="duration"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration</FormLabel>
                            <FormControl>
                              <Input placeholder="Jan 2023 - Present" {...field} />
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
                            <FormLabel>Image URL (Optional)</FormLabel>
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
                  <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No career entries in Supabase</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Subtitle</TableHead>
                      <TableHead className="hidden sm:table-cell">Duration</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {supabaseData.map((career) => (
                      <TableRow key={career.id}>
                        <TableCell className="font-medium">{career.title}</TableCell>
                        <TableCell>{career.subtitle}</TableCell>
                        <TableCell className="hidden sm:table-cell">{career.duration}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleSupabaseEdit(career)}>
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
                                <AlertDialogTitle>Delete Career?</AlertDialogTitle>
                                <AlertDialogDescription>This will delete "{career.title}".</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleSupabaseDelete(career.id)}>Delete</AlertDialogAction>
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
