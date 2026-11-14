import type { Metadata } from "next"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import { getAllChangelogs } from "@/lib/mdx"
import BaseLayout from "@/components/layout/base-layout"
import { PageHeader } from "@/components/ui/page-header"
import { Badge } from "@/components/ui/badge"
import { StatusLine } from "@/components/ui/status-line"
import { SectionIcon } from "@/components/layout/section-icons"

export const metadata: Metadata = {
  title: "Changelog | Rizky Haksono",
  description: "What changed on this site, and when.",
  alternates: { canonical: "/changelog" },
}

const released = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })

/** Release notes, newest first, one Notion block each: the version tag and title with a ¶ permalink, the date, then the notes. */
export default function ChangelogPage() {
  const changelogs = getAllChangelogs()

  return (
    <BaseLayout>
      <PageHeader
        icon={<SectionIcon href="/changelog" />}
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
        <div>
          {changelogs.map(({ meta, content, slug }) => (
            <article key={slug} id={slug} className="scroll-mt-16 border-t border-border py-10 first:border-t-0 first:pt-0">
              <h2 className="text-h2 text-balance text-foreground">
                <Badge className="mr-2 align-middle font-medium tabular-nums">
                  <span className="sr-only">Version </span>
                  {meta.version}
                </Badge>
                {meta.title}{" "}
                <a
                  href={`#${slug}`}
                  aria-label="Permalink"
                  className="relative text-muted-foreground no-underline after:absolute after:-inset-3 hover:text-foreground"
                >
                  &para;
                </a>
              </h2>
              <p className="mt-2 text-small tabular-nums text-muted-foreground">
                <time dateTime={meta.date}>{released(meta.date)}</time>
              </p>
              {meta.description && <p className="mt-3 text-body text-muted-foreground">{meta.description}</p>}
              <div className="prose mt-4">
                <MDXRemote source={content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
              </div>
            </article>
          ))}
        </div>
      )}

      <p className="border-t border-border pt-6 text-small text-muted-foreground">Set in Onest.</p>
    </BaseLayout>
  )
}
