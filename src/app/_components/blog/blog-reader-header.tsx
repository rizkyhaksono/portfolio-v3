import { formatDate } from "@/commons/helpers";

interface BlogReaderHeaderProps {
  title: string;
  comments_count?: number;
  reading_time_minutes?: number;
  page_views_count?: number | null;
  published_at?: string;
}

const plural = (count: number, word: string) =>
  `${count.toLocaleString("en-US")} ${word}${count === 1 ? "" : "s"}`;

const BlogReaderHeader = ({
  title,
  comments_count = 0,
  page_views_count,
  published_at,
  reading_time_minutes,
}: BlogReaderHeaderProps) => {
  const counts = [
    reading_time_minutes ? `${reading_time_minutes} min read` : null,
    page_views_count == null ? null : plural(page_views_count, "view"),
  ].filter(Boolean);

  return (
    <header className="mb-10">
      <h1 className="max-w-3xl text-balance font-display text-4xl italic leading-[1.02] sm:text-5xl md:text-6xl">
        {title}
      </h1>
      <p className="mt-5 border-y border-border py-4 text-sm text-muted-foreground">
        {published_at && (
          <>
            Published <time dateTime={published_at}>{formatDate(published_at)}</time>.{" "}
          </>
        )}
        {counts.length > 0 && `${counts.join(", ")}, `}
        {/* Native anchor: html scroll-behavior + scroll-padding-top in globals.css handle the glide and offset. */}
        <a
          href="#comments"
          className="text-foreground underline decoration-1 underline-offset-[0.18em] hover:decoration-2"
        >
          {plural(comments_count, "comment")}
        </a>
        .
      </p>
    </header>
  );
};

export default BlogReaderHeader;
