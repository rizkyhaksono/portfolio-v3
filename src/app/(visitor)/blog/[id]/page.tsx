import BlurFade from "@/components/magicui/blur-fade";
import { getBlogBySlug } from "@/lib/services/blog";
import { headers } from 'next/headers';

export default async function BlogDetail() {
  const headersList = headers();
  const referer = headersList.get('referer')
  const seperateUrl = referer?.split('/');
  const slug = seperateUrl?.[seperateUrl.length - 1];

  const data = await getBlogBySlug(slug as string);

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