"use client"

import CardBlog from "@/components/layout/user/card-blog";
import { useGetBlog } from "@/lib/hooks/useBlog";

export default function BlogPage() {
  const { data: blogs } = useGetBlog();

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
