import BlurFade from "@/components/magicui/blur-fade";
import CardBlog from "@/components/layout/user/card-blog";
import { getAllBlog } from "@/lib/services/blog";

export default async function BlogPage() {
  const blogs = await getAllBlog();

  return (
    <BlurFade delay={0.25} inView>
      <div className="text-center">
        <p className="text-center text-xl font-semibold">Blog</p>
        <div className="mt-2 text-sm text-muted-foreground">
          {`I write about my experiences, thoughts, and ideas on various topics.`}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 mt-4">
        {blogs?.map((blog: any) => (
          <CardBlog
            key={blog.id}
            title={blog?.title}
            description={blog?.subtitle}
            href={`/blog/${blog?.slug}`}
          />
        ))}
      </div>
    </BlurFade>
  );
}
