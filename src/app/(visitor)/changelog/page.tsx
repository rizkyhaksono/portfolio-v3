import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"
import { getAllChangelogs } from "@/lib/mdx"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { formatDate } from "@/commons/helpers"
import { MDXRemote } from "next-mdx-remote/rsc"
import { getMDXComponents } from "@/components/ui/changelog-mdx-component"

export default function ChangelogPage() {
  const changelogs = getAllChangelogs()
  const components = getMDXComponents()

  return (
    <div className="min-h-screen bg-background relative">
      <div className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto relative">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                aria-label="Go back to homepage"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary text-sm font-medium text-foreground/80 hover:text-foreground transition-all duration-200"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              <div className="h-5 w-px bg-border hidden sm:block" />
              <h1 className="text-lg font-semibold tracking-tight">Changelog</h1>
            </div>
            <AnimatedThemeToggler />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-10 pt-10">
        <div className="relative">
          {changelogs.map((changelog) => {
            const { meta, content, slug } = changelog
            const date = new Date(meta.date)
            const formattedDate = formatDate(date)

            return (
              <div key={slug} className="relative">
                <div className="flex flex-col md:flex-row gap-y-6">
                  <div className="md:w-48 flex-shrink-0">
                    <div className="md:sticky md:top-8 pb-10">
                      <time className="text-sm font-medium text-muted-foreground block mb-3">{formattedDate}</time>

                      {meta.version && <div className="inline-flex relative z-10 items-center justify-center w-10 h-10 text-foreground border border-border rounded-lg text-sm font-bold">{meta.version}</div>}
                    </div>
                  </div>

                  <div className="flex-1 md:pl-8 relative pb-10">
                    <div className="hidden md:block absolute top-2 left-0 w-px h-full bg-border">
                      <div className="hidden md:block absolute -translate-x-1/2 size-3 bg-primary rounded-full z-10" />
                    </div>

                    <div className="space-y-6">
                      <div className="relative z-10 flex flex-col gap-2">
                        <h2 className="text-2xl font-semibold tracking-tight text-balance">{meta.title}</h2>
                      </div>

                      <div className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-8 prose-headings:font-semibold prose-a:no-underline prose-headings:tracking-tight prose-headings:text-balance prose-p:tracking-tight prose-p:text-balance">
                        <MDXRemote source={content} components={components} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
