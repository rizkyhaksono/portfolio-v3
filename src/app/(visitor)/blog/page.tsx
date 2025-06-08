import CardBlogMedium from "@/app/_components/blog/blog-medium";
import CardBlog from "@/app/_components/blog/card-blog";
import BlurFade from "@/components/magicui/blur-fade";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getBlogData, getBlogMedium } from "@/services/visitor/blog";

export default async function BlogPage() {
  const blogs = await getBlogData();
  const medium = await getBlogMedium();

  return (
    <BlurFade delay={0.25} inView>
      <div className="text-center">
        <p className="text-center text-xl font-semibold">Blog</p>
        <div className="mt-2 text-sm text-muted-foreground">
          {`I write about my experiences, thoughts, and ideas on various topics.`}
        </div>
      </div>
      <Tabs defaultValue="devto" className="w-full flex flex-col items-center mt-5">
        <TabsList>
          <TabsTrigger value="devto">Dev To</TabsTrigger>
          <TabsTrigger value="medium">Medium</TabsTrigger>
        </TabsList>
        <TabsContent value="devto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
            {blogs.map((blog) => (
              <CardBlog
                key={blog.id}
                title={blog.title}
                description={blog.description}
                image={blog.cover_image}
                href={`/blog/${blog.slug}?id=${blog.id}`}
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="medium">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
            {medium?.items.map((blog: any) => (
              <CardBlogMedium
                key={blog.guid}
                title={blog.title}
                description={blog.description}
                href={blog.link}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </BlurFade>
  );
}
