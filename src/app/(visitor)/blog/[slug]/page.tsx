import BlurFade from "@/components/magicui/blur-fade"
import { getBlogDetail, getBlogViews, getComments } from "@/services/visitor/blog"
import BlogReaderView from "@/app/_components/blog/blog-reader-view";
import { notFound } from "next/navigation";

type Params = Promise<{ content: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function BlogDetail(props: Readonly<{
  params: Params
  searchParams: SearchParams
}>) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const blog = await getBlogDetail({ params, searchParams });
  const pageViewCount = await getBlogViews(searchParams.id as string);
  const comments = await getComments(searchParams.id as string);

  if (pageViewCount === undefined) return notFound();

  return (
    <BlurFade delay={0.25} inView>
      <BlogReaderView
        content={blog}
        pageViewCount={pageViewCount}
        comments={comments}
      />
    </BlurFade>
  );
}