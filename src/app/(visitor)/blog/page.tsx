import BlurFade from "@/components/magicui/blur-fade";
import CardBlog from "@/app/_components/blog/card-blog";
import { getBlogData } from "@/services/visitor/blog";

export default async function BlogPage() {
  const blogs = await getBlogData();

  return (
    <BlurFade delay={0.25} inView>
      <div className="text-center">
        <p className="text-center text-xl font-semibold">Blog</p>
        <div className="mt-2 text-sm text-muted-foreground">
          {`I write about my experiences, thoughts, and ideas on various topics.`}
        </div>
      </div>
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
    </BlurFade>
  );
}
