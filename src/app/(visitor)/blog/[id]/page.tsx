import BlurFade from "@/components/magicui/blur-fade"
import { getBlogDetail } from "@/services/blog"

type BlogsDetailPageProps = {
  params: { content: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function BlogDetail({
  params,
  searchParams,
}: Readonly<BlogsDetailPageProps>) {
  const blog = await getBlogDetail({ params, searchParams });
  // console.log(blog)

  return (
    <BlurFade delay={0.25} inView>
      <div
        className="text-start text-xl font-semibold"
        dangerouslySetInnerHTML={{ __html: blog.title }}
      />
      <div
        className="mt-5 text-start text-base font-normal"
        dangerouslySetInnerHTML={{ __html: blog.body_html }}
      />
    </BlurFade>
  )
}