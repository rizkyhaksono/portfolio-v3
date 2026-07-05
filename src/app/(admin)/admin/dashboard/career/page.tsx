"use client"

import { useEffect, useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Cloud, Loader2, Pencil, Plus, Trash } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import {
  getSupabaseCareersClient,
  createSupabaseCareerClient,
  updateSupabaseCareerClient,
  deleteSupabaseCareerClient,
  type SupabaseCareer,
} from "@/services/admin/client-services"

const formSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  subtitle: z.string().min(2, "Subtitle must be at least 2 characters"),
  duration: z.string().min(2, "Duration must be at least 2 characters"),
  image: z.string().nullable().optional(),
})

export default function AdminCareerPage() {
  const [careers, setCareers] = useState<SupabaseCareer[]>([])
  const [editing, setEditing] = useState<SupabaseCareer | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", subtitle: "", duration: "", image: null },
  })

  const fetchData = async () => {
    setIsLoading(true)
    try {
      setCareers(await getSupabaseCareersClient())
    } catch (error) {
      console.error("Failed to fetch careers:", error)
      toast.error("Failed to load careers")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const payload = {
        title: values.title,
        subtitle: values.subtitle,
        duration: values.duration,
        image: values.image ?? null,
      }
      if (editing) {
        await updateSupabaseCareerClient(editing.id, payload)
        toast.success("Career updated!")
      } else {
        await createSupabaseCareerClient(payload)
        toast.success("Career created!")
      }
      setIsDialogOpen(false)
      form.reset()
      setEditing(null)
      fetchData()
    } catch (error) {
      console.error("Failed to save:", error)
      toast.error(error instanceof Error ? error.message : "Failed to save career")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(career: SupabaseCareer) {
    try {
      await deleteSupabaseCareerClient(career.id)
      toast.success("Career deleted!")
      fetchData()
    } catch (error) {
      console.error("Delete failed:", error)
      toast.error(error instanceof Error ? error.message : "Failed to delete career")
    }
  }

  function handleEdit(career: SupabaseCareer) {
    setEditing(career)
    form.reset({
      title: career.title || "",
      subtitle: career.subtitle || "",
      duration: career.duration || "",
      image: career.image,
    })
    setIsDialogOpen(true)
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

      <div className="flex gap-4 flex-wrap">
        <Badge variant="outline" className="text-sm py-1 px-3">
          <Cloud className="h-4 w-4 mr-2" />
          Supabase: {careers.length} entries
        </Badge>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Career Timeline
            </CardTitle>
            <CardDescription>{careers.length} total entries in Supabase database</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditing(null)
                  form.reset({ title: "", subtitle: "", duration: "", image: null })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Career
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>{editing ? "Edit Career" : "Add Career"}</DialogTitle>
                <DialogDescription>{editing ? "Update the career entry in Supabase." : "Add a new career entry to Supabase."}</DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
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
                    control={form.control}
                    name="subtitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subtitle</FormLabel>
                        <FormControl>
                          <Input placeholder="Company · Location" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration</FormLabel>
                        <FormControl>
                          <Input placeholder="Jan 2024 – Present" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/logo.png" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {editing ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {careers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No career entries yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden sm:table-cell">Subtitle</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {careers.map((career) => (
                  <TableRow key={career.id}>
                    <TableCell className="font-medium">{career.title}</TableCell>
                    <TableCell className="hidden sm:table-cell max-w-[240px] truncate">{career.subtitle}</TableCell>
                    <TableCell>{career.duration}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleEdit(career)}>
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
                            <AlertDialogAction onClick={() => handleDelete(career)}>Delete</AlertDialogAction>
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
    </div>
  )
}
