"use client"

import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { formatDay } from "@/components/layout/admin/admin-format"
import {
  createBlogPostClient,
  deleteBlogPostClient,
  getBlogPostsClient,
  updateBlogPostClient,
  type BlogPost,
} from "@/services/admin/client-services"
import { Collection, type CollectionProps } from "../_components/collection"

const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

const schema = z.object({
  title: z.string().trim().min(2, "The title needs at least 2 characters."),
  slug: z.string().trim().regex(/^[a-z0-9-]*$/, "Use lowercase letters, numbers and hyphens only."),
  description: z.string().trim().min(10, "The summary needs at least 10 characters."),
  coverImage: z.string().trim().url("Use a full address, starting with https://.").or(z.literal("")),
  content: z.string().min(10, "The article needs at least 10 characters."),
  published: z.boolean(),
})

type Values = z.infer<typeof schema>

const loadPosts = () => getBlogPostsClient()

function exportPosts(posts: BlogPost[]) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(posts, null, 2)], { type: "application/json" }))
  const a = document.createElement("a")
  a.href = url
  a.download = `blog-posts-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
  toast.success(`Exported ${posts.length} posts.`)
}

const posts: CollectionProps<BlogPost, Values> = {
  noun: "post",
  plural: "posts",
  heading: "Written here",
  note: "On-site articles. Published ones show on /blog under Written here.",
  schema,
  blank: { title: "", slug: "", description: "", coverImage: "", content: "", published: false },
  fields: [
    { name: "title", label: "Title" },
    { name: "slug", label: "Slug", placeholder: "my-article", note: "Leave it empty to make one from the title." },
    { name: "description", label: "Summary", kind: "textarea", placeholder: "One or two sentences for the ledger and search results" },
    { name: "coverImage", label: "Cover image", kind: "url", placeholder: "https://…/cover.png", note: "Optional." },
    { name: "content", label: "Article", kind: "rich", placeholder: "Write the article…" },
    { name: "published", label: "Published", kind: "switch", note: "Off keeps it a draft that only this admin can see." },
  ],
  load: loadPosts,
  save: (v, editing) => {
    const payload = { ...v, slug: v.slug || slugify(v.title), coverImage: v.coverImage || undefined }
    return editing ? updateBlogPostClient(editing.id, payload) : createBlogPostClient(payload)
  },
  remove: (post) => deleteBlogPostClient(post.id),
  toValues: (p) => ({
    title: p.title,
    slug: p.slug,
    description: p.description,
    coverImage: p.coverImage ?? "",
    content: p.content,
    published: p.published,
  }),
  view: (p) => ({
    title: p.title,
    text: p.description,
    meta: p.published ? `Published ${formatDay(p.publishedAt ?? p.updated_at)}` : `Edited ${formatDay(p.updated_at)}`,
    status: p.published ? { word: "Published", mark: "filled" } : { word: "Draft", mark: "dashed" },
    link: p.published ? { href: `/blog/onsite/${p.slug}`, label: "View on the site" } : null,
  }),
  filters: [
    { label: "All", test: () => true },
    { label: "Published", test: (p) => p.published },
    { label: "Drafts", test: (p) => !p.published },
  ],
  tools: (items) => (
    <Button variant="outline" size="sm" onClick={() => exportPosts(items)} disabled={items.length === 0}>
      Export as JSON
    </Button>
  ),
}

export default function AdminBlogPage() {
  return <Collection {...posts} />
}
