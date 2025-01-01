import { CommentItemProps } from "@/commons/types/blog";
import BlogCommentItem from "./blog-comment-item";

interface BlogCommentListProps {
  id: number;
  totalComments: number;
  comments: CommentItemProps[];
}

export default function BlogCommentList({
  totalComments,
  comments,
}: BlogCommentListProps) {
  return (
    <section id="comments" className="space-y-5 pb-6 pt-4">
      {totalComments >= 1 ? (
        <>
          <div
            data-testid="comment-count"
            className="pb-5 text-xl font-semibold"
          >
            {totalComments} Comment{totalComments > 1 && "s"}
          </div>
          {comments?.map((comment) => (
            <BlogCommentItem key={comment?.id_code} {...comment} />
          ))}
        </>
      ) : (
        <div>No Comment.</div>
      )}
    </section>
  );
}