import { Button } from "@/components/ui/button";
import CardBlog from "@/components/layout/user/card-blog";
import { getAllBlog } from "@/lib/services/blog";

export default async function BlogPage() {
  const blogs = await getAllBlog();

  return (
    <>
      <div className="text-center">
        <Button className="text-base font-semibold" variant={"default"} size={"sm"}>
          Blog
        </Button>
        <div className="mt-2 text-sm text-muted-foreground">
          {`I have experience working on a wide range of projects, from basic websites to advanced web applications.`}
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
    </>
  );
}
