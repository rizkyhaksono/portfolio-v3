import { excerpt, formatDay } from "@/app/_components/blog/format"
import { getPosts } from "@/app/_components/blog/posts"
import { InkLink } from "@/components/ui/ink-link"
import { mostRead } from "@/services/visitor/most-read"
import { getAllProject } from "@/services/visitor/project"
import { getPathReads } from "@/services/visitor/umami"
import { cn } from "@/lib/utils"

interface Entry {
  key: string
  label: string
  title: string
  href: string
  meta?: string
}

async function entries(): Promise<Entry[]> {
  const [posts, projects, top] = await Promise.all([
    getPosts().catch(() => []),
    getAllProject().catch(() => []),
    getPathReads()
      .then(mostRead)
      .catch(() => []),
  ])
  const [post] = posts
  const [project] = projects
  const [read] = top

  const list: (Entry | undefined)[] = [
    post && {
      key: "writing",
      label: "Latest writing",
      title: post.title,
      href: post.href,
      meta: post.date ? formatDay(post.date) : undefined,
    },
    project && {
      key: "project",
      label: "Latest project",
      title: project.title,
      href: `/project/${project.id}`,
      meta: excerpt(project.description ?? "", 90) || undefined,
    },
    read && {
      key: "most-read",
      label: "Most read",
      title: read.title,
      href: read.path,
      meta: `${read.readers.toLocaleString("en")} readers this month`,
    },
  ]
  return list.filter((entry): entry is Entry => Boolean(entry))
}

/** The masthead's front-page column: what is newest and most read, straight from the live sources. */
export async function IssueIndex({ className }: Readonly<{ className?: string }>) {
  const items = await entries()
  if (items.length === 0) return null

  return (
    <aside aria-labelledby="issue-index" className={cn("border-l border-rule pl-8", className)}>
      <h2 id="issue-index" className="font-display text-h4 text-ink">
        In this issue
      </h2>
      <ul className="mt-5 space-y-6">
        {items.map(({ key, label, title, href, meta }) => (
          <li key={key}>
            <p className="font-display text-caption text-ink-soft">{label}</p>
            {/* Medium posts live off-site; InkLink tracks those as outbound clicks. */}
            <InkLink
              href={href}
              external={href.startsWith("http")}
              event={href.startsWith("http") ? undefined : "cta-click"}
              eventData={{ target: `issue-${key}` }}
              className="mt-1 line-clamp-3 text-pretty text-body"
            >
              {title}
            </InkLink>
            {meta && <p className="mt-1 line-clamp-2 font-display text-caption text-ink-soft">{meta}</p>}
          </li>
        ))}
      </ul>
    </aside>
  )
}
