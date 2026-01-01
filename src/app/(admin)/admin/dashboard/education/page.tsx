"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, Loader2, Pencil, Plus, Trash, Server, Cloud } from "lucide-react"
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
  getEducationClient,
  createEducationClient,
  updateEducationClient,
  deleteEducationClient,
  getSupabaseEducationsClient,
  createSupabaseEducationClient,
  updateSupabaseEducationClient,
  deleteSupabaseEducationClient,
  type BackendEducation,
  type SupabaseEducation,
} from "@/services/admin/client-services"

// Backend Education Form Schema
const backendFormSchema = z.object({
  logo: z.string().url("Must be a valid URL"),
  instance: z.string().min(2, "Institution name must be at least 2 characters"),
  address: z.string().min(2, "Address must be at least 2 characters"),
  duration: z.string().min(2, "Duration must be at least 2 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
})

// Supabase Education Form Schema
const supabaseFormSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  subtitle: z.string().min(2, "Subtitle must be at least 2 characters"),
  duration: z.string().min(2, "Duration must be at least 2 characters"),
  image: z.string().url("Must be a valid URL"),
})

type DataSource = "backend" | "supabase"

export default function AdminEducationPage() {
  // Backend state
  const [backendData, setBackendData] = useState<BackendEducation[]>([])
  const [editingBackend, setEditingBackend] = useState<BackendEducation | null>(null)
  const [isBackendDialogOpen, setIsBackendDialogOpen] = useState(false)

  // Supabase state
  const [supabaseData, setSupabaseData] = useState<SupabaseEducation[]>([])
  const [editingSupabase, setEditingSupabase] = useState<SupabaseEducation | null>(null)
  const [isSupabaseDialogOpen, setIsSupabaseDialogOpen] = useState(false)

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState<DataSource>("backend")

  // Backend form
  const backendForm = useForm<z.infer<typeof backendFormSchema>>({
    resolver: zodResolver(backendFormSchema),
    defaultValues: {
      logo: "",
      instance: "",
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
      const [backendRes, supabaseRes] = await Promise.all([getEducationClient({ page: 1, limit: 50 }).catch(() => ({ data: [] })), getSupabaseEducationsClient().catch(() => [])])
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
      if (editingBackend) {
        await updateEducationClient(editingBackend.id, values)
        toast.success("Education updated!")
      } else {
        await createEducationClient(values)
        toast.success("Education created!")
      }
      setIsBackendDialogOpen(false)
      backendForm.reset()
      setEditingBackend(null)
      fetchData()
    } catch (error) {
      console.error("Failed to save:", error)
      toast.error("Failed to save education")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleBackendDelete(id: string) {
    try {
      await deleteEducationClient(id)
      toast.success("Education deleted!")
      fetchData()
    } catch (error) {
      console.error("Delete failed:", error)
      toast.error("Failed to delete education")
    }
  }

  function handleBackendEdit(edu: BackendEducation) {
    setEditingBackend(edu)
    backendForm.reset({
      logo: edu.logo || "",
      instance: edu.instance || "",
      address: edu.address || "",
      duration: edu.duration || "",
      content: edu.content || "",
    })
    setIsBackendDialogOpen(true)
  }

  // Supabase CRUD handlers
  async function onSupabaseSubmit(values: z.infer<typeof supabaseFormSchema>) {
    setIsSubmitting(true)
    try {
      if (editingSupabase) {
        await updateSupabaseEducationClient(editingSupabase.id, values)
        toast.success("Education updated!")
      } else {
        await createSupabaseEducationClient(values)
        toast.success("Education created!")
      }
      setIsSupabaseDialogOpen(false)
      supabaseForm.reset()
      setEditingSupabase(null)
      fetchData()
    } catch (error) {
      console.error("Failed to save:", error)
      toast.error("Failed to save education")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSupabaseDelete(id: string) {
    try {
      await deleteSupabaseEducationClient(id)
      toast.success("Education deleted!")
      fetchData()
    } catch (error) {
      console.error("Delete failed:", error)
      toast.error("Failed to delete education")
    }
  }

  function handleSupabaseEdit(edu: SupabaseEducation) {
    setEditingSupabase(edu)
    supabaseForm.reset({
      title: edu.title || "",
      subtitle: edu.subtitle || "",
      duration: edu.duration || "",
      image: edu.image || "",
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
            <GraduationCap className="h-8 w-8" />
            Education
          </h1>
          <p className="text-muted-foreground">Manage education records from both databases</p>
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
            Backend Education
          </TabsTrigger>
          <TabsTrigger value="supabase" className="gap-2">
            <Cloud className="h-4 w-4" />
            Supabase Education
          </TabsTrigger>
        </TabsList>

        {/* Backend Education Tab */}
        <TabsContent value="backend">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Backend Education
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
                    Add Education
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingBackend ? "Edit Education" : "Add Education"}</DialogTitle>
                    <DialogDescription>{editingBackend ? "Update the education in Backend API." : "Add new education to Backend API."}</DialogDescription>
                  </DialogHeader>
                  <Form {...backendForm}>
                    <form onSubmit={backendForm.handleSubmit(onBackendSubmit)} className="space-y-4">
                      <FormField
                        control={backendForm.control}
                        name="logo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Institution Logo URL</FormLabel>
                            <FormControl>
                              <Input placeholder="https://example.com/logo.png" {...field} />
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
                            <FormLabel>Institution Name</FormLabel>
                            <FormControl>
                              <Input placeholder="University of Technology" {...field} />
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
                              <Input placeholder="City, Country" {...field} />
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
                              <Input placeholder="2019 - 2023" {...field} />
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
                              <RichTextEditor content={field.value} onChange={field.onChange} placeholder="Describe your degree and achievements..." />
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
                  <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No education in Backend</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Institution</TableHead>
                      <TableHead className="hidden md:table-cell">Location</TableHead>
                      <TableHead className="hidden sm:table-cell">Duration</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backendData.map((edu) => (
                      <TableRow key={edu.id}>
                        <TableCell className="font-medium">{edu.instance}</TableCell>
                        <TableCell className="hidden md:table-cell">{edu.address}</TableCell>
                        <TableCell className="hidden sm:table-cell">{edu.duration}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleBackendEdit(edu)}>
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
                                <AlertDialogTitle>Delete Education?</AlertDialogTitle>
                                <AlertDialogDescription>This will delete "{edu.instance}".</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleBackendDelete(edu.id)}>Delete</AlertDialogAction>
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

        {/* Supabase Education Tab */}
        <TabsContent value="supabase">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5" />
                  Supabase Education
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
                    Add Education
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>{editingSupabase ? "Edit Education" : "Add Education"}</DialogTitle>
                    <DialogDescription>{editingSupabase ? "Update the education in Supabase." : "Add new education to Supabase."}</DialogDescription>
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
                              <Input placeholder="Bachelor's Degree" {...field} />
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
                            <FormLabel>Subtitle / Institution</FormLabel>
                            <FormControl>
                              <Input placeholder="University of Technology" {...field} />
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
                              <Input placeholder="2019 - 2023" {...field} />
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
                              <Input placeholder="https://example.com/image.png" {...field} />
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
                  <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No education in Supabase</p>
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
                    {supabaseData.map((edu) => (
                      <TableRow key={edu.id}>
                        <TableCell className="font-medium">{edu.title}</TableCell>
                        <TableCell>{edu.subtitle}</TableCell>
                        <TableCell className="hidden sm:table-cell">{edu.duration}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleSupabaseEdit(edu)}>
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
                                <AlertDialogTitle>Delete Education?</AlertDialogTitle>
                                <AlertDialogDescription>This will delete "{edu.title}".</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleSupabaseDelete(edu.id)}>Delete</AlertDialogAction>
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
