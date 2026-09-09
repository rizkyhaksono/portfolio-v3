import React from "react";
import Link from "next/link";
import { BlogDetailProps, CommentItemProps } from "@/commons/types/blog";
import BlogReaderHeader from "./blog-reader-header";
import ImageRender from "@/components/ui/image-render";
import { Separator } from "@/components/ui/separator";
import MDXComponent from "@/components/ui/mdx-components";
import BlogCommentList from "./blog-comment-list";
import Typography from "@/components/ui/typography";
import { Chip } from "@/components/ui/chip";

interface BlogReaderViewProps {
  content: BlogDetailProps;
  comments: CommentItemProps[];
  pageViewCount: number;
}

const BlogReaderView = ({
  content,
  comments,
  pageViewCount,
}: BlogReaderViewProps) => {
  const {
    cover_image,
    title,
    body_markdown,
    comments_count,
    published_at,
    tags,
    reading_time_minutes,
    id,
    url,
  } = content;
  return (
    <article className="mx-auto w-full max-w-3xl pb-12 pt-4">
      <div className="mb-10 text-start text-sm text-muted-foreground">
        <Link
          href={"/blog"}
        >
          ← Back to blog
        </Link>
      </div>
      <BlogReaderHeader
        title={title}
        comments_count={comments_count}
        reading_time_minutes={reading_time_minutes}
        published_at={published_at}
        page_views_count={pageViewCount}
      />
      <div className="space-y-8 text-foreground/90">
        <div className="overflow-hidden border-y border-border">
          <ImageRender
            src={cover_image}
            width={800}
            height={500}
            alt={title}
            className="w-full"
          />
        </div>
        {body_markdown && <MDXComponent>{body_markdown}</MDXComponent>}
      </div>
      {tags?.length >= 1 && (
        <div className="my-12 border-y border-border py-5">
          <Typography.H3 className="m-0 text-sm font-medium">Filed under</Typography.H3>
          <div className="flex flex-wrap gap-2 pt-2">
            {Array.from(new Set(tags)).map((stack: string) => (
              <Chip key={stack}>{stack}</Chip>
            ))}
          </div>
        </div>
      )}
      <Separator className="my-10" />
      <div className="mb-4 flex flex-col space-y-2">
        <Typography.H3 className="text-lg font-medium">
          Continue the conversation on DEV Community
        </Typography.H3>
        <Link href={url} target="_blank" className="text-primary hover:underline">
          {url}
        </Link>
      </div>
      <BlogCommentList
        id={id}
        totalComments={comments_count}
        comments={comments}
      />
    </article>
  );
};

export default BlogReaderView;
