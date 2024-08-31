"use client";

import { usePathname } from "next/navigation";
import { useGetBlogById } from "@/lib/hooks/useBlog";

export default function BlogDetail() {
  const pathname = usePathname();
  const id = pathname.split("/").pop();
  const { data } = useGetBlogById(id ?? "");

  return (
    <>
      <p className="text-center text-2xl font-semibold">{data?.title}</p>
      <div className="mt-5 flex flex-col gap-5">
        <div className="p-5 rounded-xl">
          <div
            className="prose max-w-full text-pretty font-sans text-sm dark:prose-invert pt-2"
            dangerouslySetInnerHTML={{ __html: data?.content }}
          />
        </div>
      </div>
    </>
  );
}