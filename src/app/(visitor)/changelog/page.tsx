import type { Metadata } from "next"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import { getAllChangelogs } from "@/lib/mdx"
import BaseLayout from "@/components/layout/base-layout"
import { LedgerList } from "@/components/ui/ledger"

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
      <div>
        <header className="pb-8">
          <h1 className="speckle text-h1 text-balance text-foreground">Changelog</h1>
          <p className="mt-4 text-caption text-muted-foreground">
            Follow it in a feed reader with the{" "}
            <a
              href="/changelog.xml"
              data-track="rss-subscribe"
              data-track-feed="changelog"
              className="relative text-foreground underline decoration-1 underline-offset-[0.18em] after:absolute after:-inset-3 hover:decoration-2"
            >
              RSS feed
            </a>
            .
          </p>
        </header>
        <div aria-hidden className="border-t border-foreground" />

        {/* The head rule tops the first release, so its own top rule would stack under it. */}
        <div className="mt-8 [&>:first-child]:border-t-0">
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
                  <h2 className="text-h3 text-balance text-foreground">
                    {meta.title}{" "}
                    <a href={`#${slug}`} aria-label="Permalink" className="relative not-italic after:absolute after:-inset-3 text-muted-foreground no-underline hover:text-foreground hover:underline">
                      &para;
                    </a>
                  </h2>
                  <p className="mt-1 text-caption text-muted-foreground">Released {released(meta.date)}.</p>
                  {meta.description && <p className="mt-3 max-w-[66ch] text-body text-muted-foreground">{meta.description}</p>}
                  <div className="prose mt-4">
                    <MDXRemote source={content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
                  </div>
                </article>
              </li>
            </LedgerList>
          ))}
        </div>

        <section aria-labelledby="colophon" className="mt-8 border-t border-foreground pt-6">
          <h2 id="colophon" className="text-h3 text-foreground">Colophon</h2>
          <p className="mt-2 max-w-[62ch] text-body text-muted-foreground">
            Set in Plus Jakarta Sans by Tokotype. Printed in one ink in Malang, East Java. Hero plate after Johan Conrad
            Greive and Abraham Salm, <cite>Gezicht op de Bromo vulkaan</cite>, 1869, Rijksmuseum. Footer plate after
            Wenceslaus Hollar, <cite>Landscape with a Rider</cite>, 1650, after Jan Wildens, Rijksmuseum. Both public domain.
          </p>
        </section>
      </div>
    </BaseLayout>
  )
}
