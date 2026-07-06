import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"
import { getAllChangelogs } from "@/lib/mdx"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { formatDate } from "@/commons/helpers"
import { MDXRemote } from "next-mdx-remote/rsc"
import { getMDXComponents } from "@/components/ui/changelog-mdx-component"
import { Button } from "@/components/ui/button"
import { Eyebrow } from "@/components/ui/eyebrow"
import { Chip } from "@/components/ui/chip"
import { SectionHeading } from "@/components/ui/section-heading"

export default function ChangelogPage() {
  const changelogs = getAllChangelogs()
  const components = getMDXComponents()

  return (
    <div className="min-h-screen bg-background relative">
      <div className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-5xl mx-auto relative">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/" aria-label="Go back to homepage">
                  <ArrowLeftIcon />
                  <span className="hidden sm:inline">Back</span>
                </Link>
              </Button>
              <div className="h-5 w-px bg-border hidden sm:block" />
              <h1 className="font-display text-lg font-bold tracking-tight">Changelog</h1>
            </div>
            <AnimatedThemeToggler />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-10 pt-10">
        <SectionHeading
          className="mb-12"
          eyebrow="CHANGELOG"
          title="Release"
          accent="notes"
          description="A running log of everything I've shipped — new features, fixes, and refinements across the portfolio."
        />

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
                      <Eyebrow className="mb-3">
                        <time>{formattedDate}</time>
                      </Eyebrow>

                      {meta.version && <Chip className="relative z-10">{meta.version}</Chip>}
                    </div>
                  </div>

                  <div className="flex-1 md:pl-8 relative pb-10">
                    <div className="hidden md:block absolute top-2 left-0 w-px h-full bg-border">
                      <div className="hidden md:block absolute -translate-x-1/2 size-3 bg-primary rounded-full z-10" />
                    </div>

                    <div className="space-y-6">
                      <div className="relative z-10 flex flex-col gap-2">
                        <h2 className="font-display text-2xl font-semibold tracking-tight text-balance">{meta.title}</h2>
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
