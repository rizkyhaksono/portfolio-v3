import { getBlogBySlug } from "@/lib/services/blog";
import { headers } from 'next/headers';

export default async function BlogDetail() {
  const headersList = headers();
  const fullUrl = headersList.get('referer') || "";
  const seperateUrl = fullUrl.split("/");
  const slug = seperateUrl[seperateUrl.length - 1];

  const data = await getBlogBySlug(slug);

  return (
    <>
      {data?.map((blog: any) => (
        <div key={blog?.id} className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-semibold">{blog?.title}</h1>
          <div className="mt-2 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: blog?.subtitle }} />
          <div className="mt-4" dangerouslySetInnerHTML={{ __html: blog?.content }} />
        </div>
      ))}
    </>
  );
}