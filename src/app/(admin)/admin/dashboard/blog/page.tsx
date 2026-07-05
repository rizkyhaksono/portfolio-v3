"use client"

import { useEffect, useMemo, useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import Link from "next/link"
import { format } from "date-fns"
import {
  getBlogPostsClient,
  createBlogPostClient,
  updateBlogPostClient,
  deleteBlogPostClient,
  type BlogPost,
} from "@/services/admin/client-services"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { File, ListFilter, Loader2, Pencil, Trash, ExternalLink } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

const formSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers, hyphens"),
  description: z.string().min(10),
  content: z.string().min(10),
  coverImage: z.string().url().optional().or(z.literal("")),
  published: z.boolean().default(false),
})

type StatusFilter = "all" | "published" | "draft"

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function formatDate(value?: string | null) {
  if (!value) return "—"
  try {
    return format(new Date(value), "dd MMM yyyy, HH:mm")
  } catch {
    return "—"
  }
}

function truncateId(id: string, len = 8) {
  return id.length > len ? `${id.slice(0, len)}…` : id
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [editing, setEditing] = useState<BlogPost | null>(null)
  const [activeTab, setActiveTab] = useState("allPosts")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      content: "",
      coverImage: "",
      published: false,
    },
  })

  const filteredPosts = useMemo(() => {
    if (statusFilter === "published") return posts.filter((p) => p.published)
    if (statusFilter === "draft") return posts.filter((p) => !p.published)
    return posts
  }, [posts, statusFilter])

  const loadPosts = async () => {
    setLoading(true)
    try {
      setPosts(await getBlogPostsClient())
    } catch {
      toast.error("Failed to load blog posts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const resetForm = () => {
    setEditing(null)
    form.reset({
      title: "",
      slug: "",
      description: "",
      content: "",
      coverImage: "",
      published: false,
    })
  }

  const openCreate = () => {
    resetForm()
    setActiveTab("newPost")
  }

  const openEdit = (post: BlogPost) => {
    setEditing(post)
    form.reset({
      title: post.title,
      slug: post.slug,
      description: post.description,
      content: post.content,
      coverImage: post.coverImage ?? "",
      published: post.published,
    })
    setActiveTab("newPost")
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitting(true)
    try {
      const payload = {
        ...values,
        coverImage: values.coverImage || undefined,
      }
      if (editing) {
        await updateBlogPostClient(editing.id, payload)
        toast.success("Post updated")
      } else {
        await createBlogPostClient(payload)
        toast.success("Post created")
      }
      resetForm()
      setActiveTab("allPosts")
      await loadPosts()
    } catch {
      toast.error("Save failed")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteBlogPostClient(id)
      toast.success("Post deleted")
      if (editing?.id === id) resetForm()
      await loadPosts()
    } catch {
      toast.error("Delete failed")
    }
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(posts, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `blog-posts-${format(new Date(), "yyyy-MM-dd")}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Exported blog posts")
  }

  const filterLabel =
    statusFilter === "published" ? "Published" : statusFilter === "draft" ? "Draft" : "All"

  const BlogForm = () => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e)
                    if (!editing) form.setValue("slug", slugify(e.target.value))
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input {...field} placeholder="my-article-slug" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} rows={2} placeholder="Short summary for cards and SEO" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="coverImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover image URL</FormLabel>
              <FormControl>
                <Input {...field} placeholder="https://..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <RichTextEditor content={field.value} onChange={field.onChange} placeholder="Write your article..." />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="published"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <FormLabel>Published</FormLabel>
                <p className="text-xs text-muted-foreground">Shows on /blog under &quot;Written here&quot;</p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={submitting} className="flex-1">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : editing ? "Update post" : "Create post"}
          </Button>
          {editing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm()
                setActiveTab("allPosts")
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  )

  if (loading && posts.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-7 w-20" />
          </div>
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">

      <Tabs
        value={activeTab}
        onValueChange={(value) => {
          setActiveTab(value)
          if (value === "newPost" && !editing) resetForm()
        }}
        className="max-[644px]:mt-4"
      >
        <div className="flex flex-wrap items-center gap-2">
          <TabsList>
            <TabsTrigger value="allPosts">All Posts</TabsTrigger>
            <TabsTrigger value="newPost">{editing ? "Edit Post" : "New Post"}</TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1 text-sm">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">{filterLabel}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked={statusFilter === "all"} onCheckedChange={() => setStatusFilter("all")}>
                  All
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter === "published"}
                  onCheckedChange={() => setStatusFilter("published")}
                >
                  Published
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={statusFilter === "draft"} onCheckedChange={() => setStatusFilter("draft")}>
                  Draft
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-7 gap-1 text-sm" onClick={handleExport} disabled={posts.length === 0}>
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Export</span>
            </Button>
            {activeTab === "allPosts" && (
              <Button size="sm" className="h-7 text-sm" onClick={openCreate}>
                New Post
              </Button>
            )}
          </div>
        </div>

        <TabsContent value="allPosts">
          <Card>
            <CardHeader className="px-7">
              <CardTitle>Blog posts</CardTitle>
              <CardDescription>
                {filteredPosts.length} of {posts.length} post{posts.length !== 1 ? "s" : ""}
                {statusFilter !== "all" ? ` (${filterLabel})` : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : filteredPosts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {posts.length === 0 ? "No posts yet. Create one in the New Post tab." : "No posts match this filter."}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="hidden lg:table-cell">ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden sm:table-cell">Slug</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">Published at</TableHead>
                      <TableHead className="text-left">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPosts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="hidden lg:table-cell font-mono text-xs text-muted-foreground">
                          {truncateId(post.id)}
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{post.title}</p>
                          <p className="text-xs text-muted-foreground sm:hidden">/{post.slug}</p>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-muted-foreground">/{post.slug}</TableCell>
                        <TableCell>
                          <Badge variant={post.published ? "default" : "secondary"}>
                            {post.published ? "Published" : "Draft"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {formatDate(post.publishedAt ?? post.updated_at)}
                        </TableCell>
                        <TableCell className="text-left">
                          <div className="flex items-center gap-1">
                            {post.published && (
                              <Link href={`/blog/onsite/${post.slug}`} target="_blank">
                                <Button variant="outline" size="icon" title="Preview">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </Link>
                            )}
                            <Button variant="outline" size="icon" onClick={() => openEdit(post)} title="Edit">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="icon" title="Delete">
                                  <Trash className="h-4 w-4 text-destructive" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete &quot;{post.title}&quot;?</AlertDialogTitle>
                                  <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(post.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="newPost">
          <Card>
            <CardHeader className="px-7">
              <CardTitle>{editing ? `Edit: ${editing.title}` : "New post"}</CardTitle>
              <CardDescription>
                {editing ? "Update the article and save." : "Create an on-site article for the Written here tab on /blog."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BlogForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
