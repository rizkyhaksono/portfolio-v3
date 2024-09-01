import CardBlog from "@/components/layout/user/card-blog";
import { getAllBlog } from "@/lib/services/blog";

export default async function BlogPage() {
  const blogs = await getAllBlog();

  return (
    <>
      <p className="text-center text-2xl font-semibold mb-5">Blogs</p>
      <div className="mt-5 flex flex-col gap-5">
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
