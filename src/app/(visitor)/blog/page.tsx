"use client"

import { useGetBlog } from "@/lib/hooks/useBlog";

export default function BlogPage() {
  const { data: blogs } = useGetBlog();

  return (
    <>
      <p className="text-center text-2xl font-semibold mb-5">Blog</p>
      <div className="mt-5 flex flex-col gap-5">
        {blogs?.map((blog: any) => (
          <div key={blog.id} className="bg-muted/40 dark:bg-muted/20 p-5 rounded-xl">
            <p className="text-lg font-semibold underline underline-offset-8">
              {blog.title}
            </p>
            <div
              className="prose max-w-full text-pretty font-sans text-xs text-muted-foreground dark:prose-invert mt-2"
              dangerouslySetInnerHTML={{ __html: blog.subtitle }}
            />
          </div>
        ))}
      </div>
    </>
  );
}
