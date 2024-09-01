import BlurFade from "@/components/magicui/blur-fade";
import { getBlogBySlug } from "@/lib/services/blog";
import { headers } from 'next/headers';

export default async function BlogDetail() {
  const referer = headers().get('referer');
  const slug = referer?.split('/').pop();

  if (!slug) return null;
  const data = await getBlogBySlug(slug);
  if (!data || data.length === 0) return <div>No blog found</div>;

  return (
    <BlurFade delay={0.25} inView>
      {data?.map((blog: any) => (
        <div key={blog?.id} className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-semibold">{blog?.title}</h1>
          <div className="mt-2 text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: blog?.subtitle }} />
          <div className="mt-4" dangerouslySetInnerHTML={{ __html: blog?.content }} />
        </div>
      ))}
    </BlurFade>
  );
}