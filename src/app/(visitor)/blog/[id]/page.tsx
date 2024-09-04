import Link from "next/link";
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

  if (!blog) return null;

  const titleHTML = blog.title ? String(blog.title) : "";
  const bodyHTML = blog.body_html ? String(blog.body_html) : "";

  return (
    <BlurFade delay={0.25} inView>
      <Link
        href={"/blog"}
        className="text-start text-base font-normal underline underline-offset-2"
      >
        Back
      </Link>
      <div
        className="text-start text-2xl mt-5 font-semibold"
        dangerouslySetInnerHTML={{ __html: titleHTML }}
      />
      <div
        className="mt-5 text-start text-base font-normal"
        dangerouslySetInnerHTML={{ __html: bodyHTML }}
      />
    </BlurFade>
  )
}