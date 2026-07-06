import CardBlogMedium from "@/app/_components/blog/blog-medium"
import CardBlog from "@/app/_components/blog/card-blog"
import BlurFade from "@/components/magicui/blur-fade"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getBlogData, getBlogMedium } from "@/services/visitor/blog"
import { getOnsiteBlogPosts } from "@/services/visitor/onsite-blog"
import { MacWindow } from "@/components/ui/mac-window"
import { SectionHeading } from "@/components/ui/section-heading"
import { Newspaper } from "lucide-react"

export const dynamic = "force-dynamic"

function TabCount({ value }: { value: number }) {
  if (!value) return null
  return (
    <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold leading-none tabular-nums text-primary">
      {value}
    </span>
  )
}

export default async function BlogPage() {
  const [blogs, medium, onsite] = await Promise.all([
    getBlogData(),
    getBlogMedium(),
    getOnsiteBlogPosts(),
  ])

  return (
    <BlurFade delay={0.25} inView>
      <SectionHeading
        align="center"
        className="mb-8"
        eyebrow={
          <>
            <Newspaper className="h-3.5 w-3.5 text-primary" />
            Writing
          </>
        }
        title="Blog"
        accent="& notes"
        description="I write about my experiences, thoughts, and ideas on various topics."
      />
      <MacWindow title="~/blog">
      <Tabs defaultValue="devto" className="w-full">
        <div className="flex justify-center">
          <TabsList>
            <TabsTrigger value="devto">Dev To<TabCount value={blogs?.length ?? 0} /></TabsTrigger>
            <TabsTrigger value="medium">Medium<TabCount value={medium?.items?.length ?? 0} /></TabsTrigger>
            <TabsTrigger value="onsite">Written here<TabCount value={onsite?.length ?? 0} /></TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="devto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 w-full">
            {blogs.map((blog) => (
              <CardBlog key={blog.id} title={blog.title} description={blog.description} image={blog.cover_image} href={`/blog/${blog.slug}?id=${blog.id}`} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="medium">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 w-full">
            {medium?.items?.map((blog: any) => (
              <CardBlogMedium key={blog.guid} title={blog.title} description={blog.description} href={blog.link} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="onsite">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 w-full">
            {onsite.length === 0 ? (
              <p className="text-sm text-muted-foreground col-span-2 text-center py-8">No on-site posts yet.</p>
            ) : (
              onsite.map((post) => (
                <CardBlog
                  key={post.id}
                  title={post.title}
                  description={post.description}
                  image={post.coverImage ?? undefined}
                  href={`/blog/onsite/${post.slug}`}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
      </MacWindow>
    </BlurFade>
  )
}
