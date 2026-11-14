import type { Metadata } from "next"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import { getAllChangelogs } from "@/lib/mdx"
import BaseLayout from "@/components/layout/base-layout"
import { PageHeader } from "@/components/ui/page-header"
import { StatusLine } from "@/components/ui/status-line"

export const metadata: Metadata = {
  title: "Changelog | Rizky Haksono",
  description: "What changed on this site, and when.",
  alternates: { canonical: "/changelog" },
}

const released = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })

/** Release notes, newest first: a muted version and date line, the title with a quiet ¶ permalink, then the notes. */
export default function ChangelogPage() {
  const changelogs = getAllChangelogs()

  return (
    <BaseLayout>
      <PageHeader
        title="Changelog"
        description={
          <>
            Follow it in a feed reader with the{" "}
            <a
              href="/changelog.xml"
              data-track="rss-subscribe"
              data-track-feed="changelog"
              className="relative text-foreground underline decoration-foreground/25 decoration-1 underline-offset-4 after:absolute after:-inset-3 hover:decoration-foreground"
            >
              RSS feed
            </a>
            .
          </>
        }
      />

      {changelogs.length === 0 ? (
        <StatusLine kind="empty">No releases written up yet.</StatusLine>
      ) : (
        <div className="space-y-14">
          {changelogs.map(({ meta, content, slug }) => (
            <article key={slug} id={slug}>
              <p className="text-small tabular-nums text-muted-foreground">
                <span className="sr-only">Version </span>
                {meta.version}, {released(meta.date)}
              </p>
              <h2 className="mt-1 text-h2 text-balance text-foreground">
                {meta.title}{" "}
                <a
                  href={`#${slug}`}
                  aria-label="Permalink"
                  className="relative text-muted-foreground no-underline after:absolute after:-inset-3 hover:text-foreground"
                >
                  &para;
                </a>
              </h2>
              {meta.description && <p className="mt-1 text-body text-muted-foreground">{meta.description}</p>}
              <div className="prose mt-4">
                <MDXRemote source={content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="mt-14 text-small text-muted-foreground">Set in Onest.</p>
    </BaseLayout>
  )
}
