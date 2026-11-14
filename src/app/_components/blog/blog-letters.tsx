import Image from "next/image"
import type { CommentItemProps } from "@/commons/types/blog"
import { InkLink } from "@/components/ui/ink-link"
import { StatusLine } from "@/components/ui/status-line"
import { safeHtml } from "@/app/(visitor)/project/safe-html"
import { canOptimizeImage } from "@/lib/image-hosts"
import { httpUrl } from "@/lib/utils"
import { formatDay, toDate } from "./format"

function Comment({ comment }: Readonly<{ comment: CommentItemProps }>) {
  const date = toDate(comment.created_at)
  const replies = comment.children ?? []
  const avatar = httpUrl(comment.user?.profile_image_90)

  return (
    <li className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-x-3">
      {avatar ? (
        <Image src={avatar} alt="" width={24} height={24} unoptimized={!canOptimizeImage(avatar)} className="mt-0.5 size-6 rounded-full bg-muted object-cover" />
      ) : (
        <span aria-hidden className="mt-0.5 size-6 rounded-full bg-muted" />
      )}
      <div className="min-w-0">
        <p className="text-small text-muted-foreground">
          <span className="text-foreground">{comment.user?.name || "A reader"}</span>
          {date && (
            <>
              {" "}
              <time dateTime={date.toISOString()}>{formatDay(date)}</time>
            </>
          )}
        </p>
        <div className="prose prose--chat mt-1 break-words" dangerouslySetInnerHTML={{ __html: safeHtml(comment.body_html ?? "") }} />
        {replies.length > 0 && (
          <ol role="list" aria-label="Replies" className="mt-4 flex flex-col gap-4">
            {replies.map((reply) => (
              <Comment key={reply.id_code} comment={reply} />
            ))}
          </ol>
        )}
      </div>
    </li>
  )
}

interface BlogLettersProps {
  comments: CommentItemProps[]
  /** The article on DEV, where new comments are written. */
  url: string
  /** DEV's own count: comments missing while it is above zero means the fetch failed, not that there are none. */
  expected?: number
}

/** DEV comments as quiet rows (server, no JS); replies sit indented under their parent. */
export default function BlogLetters({ comments, url, expected = 0 }: Readonly<BlogLettersProps>) {
  return (
    <section id="letters" aria-labelledby="letters-title" className="mt-14">
      <h2 id="letters-title" className="text-h2 text-foreground">
        Comments
      </h2>
      {comments.length > 0 ? (
        <ol role="list" className="mt-4 flex flex-col gap-6">
          {comments.map((comment) => (
            <Comment key={comment.id_code} comment={comment} />
          ))}
        </ol>
      ) : expected > 0 ? (
        <StatusLine kind="failed" className="mt-4">
          The comments did not load just now. They are on DEV Community.
        </StatusLine>
      ) : (
        <StatusLine kind="empty" className="mt-2">
          No comments yet.
        </StatusLine>
      )}
      <p className="mt-6 text-small text-muted-foreground">
        Write one on{" "}
        <InkLink href={url} external>
          DEV Community
        </InkLink>
        ; new comments appear here within the hour.
      </p>
    </section>
  )
}
