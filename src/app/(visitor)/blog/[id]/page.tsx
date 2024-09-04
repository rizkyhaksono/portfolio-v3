import Link from "next/link";
import BlurFade from "@/components/magicui/blur-fade"
import { getBlogDetail, getBlogViews, getComments } from "@/services/blog"
import BlogReaderView from "@/modules/blog/blolg-reader-view";

type BlogsDetailPageProps = {
  params: { content: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function BlogDetail({
  params,
  searchParams,
}: Readonly<BlogsDetailPageProps>) {
  const blog = await getBlogDetail({ params, searchParams });
  const pageViewCount = await getBlogViews(searchParams.id as string);
  const comments = await getComments(searchParams.id as string);

  return (
    <BlurFade delay={0.25} inView>
      <Link
        href={"/blog"}
        className="text-start text-base font-normal underline underline-offset-2"
      >
        Back
      </Link>
      <BlogReaderView
        content={blog}
        pageViewCount={pageViewCount}
        comments={comments}
      />
    </BlurFade>
  )
}