"use client"

import { useEffect, useState } from "react";
import { supabaseUser } from "@/lib/supabase/server";
import parse from 'html-react-parser';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data, error } = await supabaseUser.from("blogs").select("*");
      if (error) {
        console.log(error);
      };
      setBlogs(data);
    };
    fetchBlogs();
  }, []);

  console.log(blogs)

  return (
    <>
      <p className="text-center text-2xl font-semibold mb-5">Blog</p>
      <div className="mt-5 flex flex-col gap-5">
        {blogs.map((blog: any) => (
          <div key={blog.id} className="bg-muted/40 dark:bg-muted/20 p-5 rounded-xl">
            <p className="text-lg font-semibold underline underline-offset-8">
              {blog.title}
            </p>
            <p className="text-sm mt-2">{parse(blog.subtitle)}</p>
          </div>
        ))}
      </div>
    </>
  );
}
