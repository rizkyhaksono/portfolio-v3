import { getAllChangelogs } from "@/lib/mdx"
import { formatDate } from "@/commons/helpers"
import { MDXRemote } from "next-mdx-remote/rsc"
import remarkGfm from "remark-gfm"
import type { MDXComponents } from "mdx/types"
import { Chip } from "@/components/ui/chip"
import { SectionHeading } from "@/components/ui/section-heading"
import BaseLayout from "@/components/layout/base-layout"
import SidebarMain from "@/components/layout/sidebar-main"
import { PageBody } from "@/components/ui/page-body"
import { cn } from "@/lib/utils"

/** Renders concise, editorial release notes from the local MDX collection. */
export default function ChangelogPage() {
  const changelogs = getAllChangelogs()
  const components: MDXComponents = {
    h2: ({ className, ...props }) => <h3 {...props} className={cn("mb-2 mt-6 font-display text-lg font-semibold", className)} />,
    h3: ({ className, ...props }) => <h4 {...props} className={cn("mb-2 mt-5 font-display text-base font-semibold", className)} />,
    p: ({ className, ...props }) => <p {...props} className={cn("mb-3 leading-7 text-muted-foreground", className)} />,
    ul: ({ className, ...props }) => <ul {...props} className={cn("mb-3 list-disc space-y-2 pl-5 text-muted-foreground", className)} />,
    li: ({ className, ...props }) => <li {...props} className={cn("pl-1 leading-6", className)} />,
    a: ({ className, ...props }) => <a {...props} className={cn("text-foreground underline underline-offset-4", className)} />,
  }

  return (
    <BaseLayout sidebar={<SidebarMain />}>
      <PageBody width="article" className="pt-4">
        <SectionHeading
          className="mb-8"
          eyebrow="CHANGELOG"
          title="Release"
          accent="notes"
          description="Short notes on meaningful changes to this portfolio."
        />

        <div className="border-t border-border">
          {changelogs.map((changelog) => {
            const { meta, content, slug } = changelog
            const date = new Date(meta.date)
            const formattedDate = formatDate(date)

            return (
              <article key={slug} id={slug} className="grid gap-4 border-b border-border py-7 md:grid-cols-[9rem_minmax(0,1fr)] md:gap-8">
                <div className="flex items-center gap-3 md:block">
                  <time className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">{formattedDate}</time>
                  {meta.version ? <Chip className="md:mt-3">{meta.version}</Chip> : null}
                </div>
                <div className="min-w-0">
                  <h2 className="text-balance font-display text-xl font-semibold tracking-tight sm:text-2xl">{meta.title}</h2>
                  {meta.description ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{meta.description}</p> : null}
                  <div className="mt-5 text-sm">
                    <MDXRemote source={content} components={components} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </PageBody>
    </BaseLayout>
  )
}
