import type { CommentItemProps } from "@/commons/types/blog"
import { InkLink } from "@/components/ui/ink-link"
import { safeHtml } from "@/app/(visitor)/project/safe-html"
import { formatDay, toDate } from "./format"

function Letter({ comment }: Readonly<{ comment: CommentItemProps }>) {
  const date = toDate(comment.created_at)
  const replies = comment.children ?? []

  return (
    <li>
      <p className="font-display text-caption text-ink-soft">
        {comment.user?.name || "A reader"} wrote
        {date && <> on <time dateTime={date.toISOString()}>{formatDay(date)}</time></>}.
      </p>
      <div className="prose prose--chat mt-2 break-words" dangerouslySetInnerHTML={{ __html: safeHtml(comment.body_html ?? "") }} />
      {replies.length > 0 && (
        <ol role="list" aria-label="Replies" className="mt-6 flex flex-col gap-6 border-l border-rule pl-4 sm:pl-6">
          {replies.map((reply) => (
            <Letter key={reply.id_code} comment={reply} />
          ))}
        </ol>
      )}
    </li>
  )
}

interface BlogLettersProps {
  comments: CommentItemProps[]
  /** The article on DEV, where new letters are written. */
  url: string
}

/** DEV comments shown as letters (server, no JS); replies sit behind a left rule. */
export default function BlogLetters({ comments, url }: Readonly<BlogLettersProps>) {
  return (
    <section id="letters" aria-labelledby="letters-title" className="mt-12 border-t border-ink pt-6">
      <h2 id="letters-title" className="font-display text-h3 text-ink">
        Letters
      </h2>
      {comments.length > 0 ? (
        <ol role="list" className="mt-6 flex flex-col gap-8">
          {comments.map((comment) => (
            <Letter key={comment.id_code} comment={comment} />
          ))}
        </ol>
      ) : (
        <p className="mt-2 font-display text-caption text-ink-soft">No letters yet.</p>
      )}
      <p className="mt-8 text-small text-ink-soft">
        Write one on{" "}
        <InkLink href={url} external>
          DEV Community
        </InkLink>
        ; new letters appear here within the hour.
      </p>
    </section>
  )
}
