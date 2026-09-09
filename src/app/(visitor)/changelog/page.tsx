import { getAllChangelogs } from "@/lib/mdx"
import { formatDate } from "@/commons/helpers"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import { getMDXComponents } from "@/components/ui/changelog-mdx-component"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Chip } from "@/components/ui/chip"
import { SectionHeading } from "@/components/ui/section-heading"
import BaseLayout from "@/components/layout/base-layout"
import SidebarMain from "@/components/layout/sidebar-main"
import { PageBody } from "@/components/ui/page-body"

export default function ChangelogPage() {
  const changelogs = getAllChangelogs()
  const components = getMDXComponents()

  return (
    <BaseLayout sidebar={<SidebarMain />}>
      <PageBody width="article" className="pt-4">
        <SectionHeading
          className="mb-12"
          eyebrow="CHANGELOG"
          title="Release"
          accent="notes"
          description="A running log of everything I've shipped — new features, fixes, and refinements across the portfolio."
        />

        <div className="relative border-t border-border pt-10">
          {changelogs.map((changelog) => {
            const { meta, content, slug } = changelog
            const date = new Date(meta.date)
            const formattedDate = formatDate(date)

            return (
              <div key={slug} className="relative">
                <div className="flex flex-col md:flex-row gap-y-6">
                  <div className="md:w-48 flex-shrink-0">
                    <div className="md:sticky md:top-8 pb-10">
                      <Eyebrow className="mb-3">
                        <time>{formattedDate}</time>
                      </Eyebrow>

                      {meta.version && <Chip className="relative z-10">{meta.version}</Chip>}
                    </div>
                  </div>

                  <div className="flex-1 md:pl-8 relative pb-10">
                    <div className="hidden md:block absolute top-2 left-0 w-px h-full bg-border">
                      <div className="absolute size-2 -translate-x-1/2 bg-primary" />
                    </div>

                    <div className="space-y-6">
                      <div className="relative z-10 flex flex-col gap-2">
                        <h2 className="font-display text-2xl font-semibold tracking-tight text-balance">{meta.title}</h2>
                      </div>

                      <div className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-8 prose-headings:font-semibold prose-a:no-underline prose-headings:tracking-tight prose-headings:text-balance prose-p:tracking-tight prose-p:text-balance">
                        <MDXRemote
                          source={content}
                          components={components}
                          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </PageBody>
    </BaseLayout>
  )
}
