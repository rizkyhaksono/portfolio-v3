import type { Metadata } from "next"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import { getAllChangelogs } from "@/lib/mdx"
import BaseLayout from "@/components/layout/base-layout"
import { LedgerList } from "@/components/ui/ledger"
import { PAGE_WIDTH } from "@/lib/design-system"

export const metadata: Metadata = {
  title: "Changelog | Rizky Haksono",
  description: "What changed on this site, and when.",
  alternates: { canonical: "/changelog" },
}

const released = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })

/** Release notes as a ledger: the version numeral in the margin, each entry with its own ¶ permalink. */
export default function ChangelogPage() {
  const changelogs = getAllChangelogs()

  return (
    <BaseLayout>
      <div className={PAGE_WIDTH.ledger}>
        <header className="pb-8">
          <h1 className="font-display text-h1 text-balance text-ink">Changelog</h1>
          <p className="mt-4 max-w-[46ch] font-display text-lead text-ink-soft">What changed on this site, and when.</p>
          <p className="mt-4 text-body text-ink-soft">
            Follow it in a feed reader with the{" "}
            <a
              href="/changelog.xml"
              data-track="rss-subscribe"
              data-track-feed="changelog"
              className="text-ink underline decoration-1 underline-offset-[0.18em] hover:decoration-2"
            >
              RSS feed
            </a>
            .
          </p>
        </header>
        <div aria-hidden className="h-[5px] border-y border-b-rule border-t-ink" />

        <div className="mt-8">
          {changelogs.map(({ meta, content, slug }) => (
            <LedgerList
              key={slug}
              marker={
                <p>
                  <span className="sr-only">Version </span>
                  {meta.version}
                </p>
              }
            >
              <li id={slug} className="pb-10 pt-3">
                <article>
                  <h2 className="font-display text-h3 text-balance text-ink">
                    {meta.title}{" "}
                    <a href={`#${slug}`} aria-label="Permalink" className="relative after:absolute after:-inset-3 text-ink-soft no-underline hover:text-ink hover:underline">
                      &para;
                    </a>
                  </h2>
                  <p className="mt-1 font-display text-caption text-ink-soft">Released {released(meta.date)}.</p>
                  {meta.description && <p className="mt-3 text-body text-ink-soft">{meta.description}</p>}
                  <div className="prose mt-4">
                    <MDXRemote source={content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
                  </div>
                </article>
              </li>
            </LedgerList>
          ))}
        </div>
      </div>
    </BaseLayout>
  )
}
