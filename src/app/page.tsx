import { Suspense, type ReactNode } from "react"
import Link from "next/link"
import BaseLayout from "@/components/layout/base-layout"
import { InkLink } from "@/components/ui/ink-link"
import { Skeleton } from "@/components/ui/skeleton"
import { StatusLine } from "@/components/ui/status-line"
import { ContactForm } from "@/app/_components/contact/contact-form"
import { getPosts } from "@/app/_components/blog/posts"
import { plainText } from "@/app/(visitor)/project/safe-html"
import { selectFeaturedProjects } from "@/app/(visitor)/project/featured"
import { getAllProject } from "@/services/visitor/project"
import { getAllCarrer } from "@/services/visitor/career"
import { getAllEducation } from "@/services/visitor/education"
import { getLinkedinRecommendations } from "@/services/visitor/linkedin"
import { EMAIL, media_socials } from "@/commons/constants/contact"
import { RESUME_GOOGLE_DRIVE_URL } from "@/commons/constants/external-links"
import { startOf } from "@/lib/career-dates"

export const revalidate = 900

const GITHUB = media_socials.find(({ title }) => title === "GitHub")!.href
const LINKEDIN = media_socials.find(({ title }) => title === "LinkedIn")!.href
const PROJECT_COUNT = 8

/** The first sentence of a description, so every row stays one quiet line. */
const firstSentence = (text: string) => plainText(text).split(/(?<=[.!?])\s/)[0] ?? ""

/** A name the prose points at: full ink against the muted sentence around it. */
function Name({ children }: Readonly<{ children: ReactNode }>) {
  return <span className="text-foreground">{children}</span>
}

function Section({ id, title, children }: Readonly<{ id: string; title: string; children: ReactNode }>) {
  return (
    <section aria-labelledby={id} className="mt-14">
      <h2 id={id} className="text-h2 text-foreground">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}

/** A title in ink with one muted line under it; the whole row is the link when there is somewhere to go. */
function Row({ href, external, title, children }: Readonly<{ href?: string; external?: boolean; title: ReactNode; children?: ReactNode }>) {
  const body = (
    <>
      <span className="block text-body text-foreground underline decoration-transparent underline-offset-4 transition-[text-decoration-color] duration-ui ease-out group-hover:decoration-foreground/40">
        {title}
      </span>
      {children && <span className="block text-body text-muted-foreground">{children}</span>}
    </>
  )
  if (!href) return <li className="py-2">{body}</li>
  return (
    <li>
      {external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" data-umami-event="outbound-click" className="group block py-2">
          {body}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : (
        <Link href={href} className="group block py-2">
          {body}
        </Link>
      )}
    </li>
  )
}

function RowsSkeleton({ rows }: Readonly<{ rows: number }>) {
  return (
    <div aria-hidden className="space-y-4 py-2">
      {Array.from({ length: rows }, (_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      ))}
    </div>
  )
}

/** Who and what, in a few muted sentences; the names are in full ink. */
function Bio() {
  return (
    <div className="space-y-5 text-body text-pretty text-muted-foreground">
      <p>
        Senior AI engineer at <Name>Sarana AI</Name> in Malang, East Java, building LLM systems for production: retrieval and
        embeddings, MCP integrations, and agents that run on AWS.
      </p>
      <p>
        I ship end-to-end products in Next.js, Go and Python, from <Name>Info Pangan Jakarta</Name>, the city&apos;s official
        food price monitor, to platforms for <Name>Adaro</Name> and <Name>Biofarma</Name>, with CI/CD I can rely on.
      </p>
      <p>
        I studied informatics at <Name>Universitas Muhammadiyah Malang</Name> and graduated cum laude. My code is on{" "}
        <InkLink href={GITHUB} external event="social-click" eventData={{ network: "github", area: "bio" }}>
          GitHub
        </InkLink>
        , I am on{" "}
        <InkLink href={LINKEDIN} external event="social-click" eventData={{ network: "linkedin", area: "bio" }}>
          LinkedIn
        </InkLink>
        , and my full history is in my{" "}
        <InkLink href={RESUME_GOOGLE_DRIVE_URL} external event="resume-open" eventData={{ area: "bio" }}>
          CV
        </InkLink>
        .
      </p>
    </div>
  )
}

async function Projects() {
  const projects = await getAllProject().catch(() => null)
  if (!projects) return <StatusLine kind="failed">Projects did not load just now. The code is on GitHub in the meantime.</StatusLine>
  if (projects.length === 0) return <StatusLine kind="empty">No projects are listed right now.</StatusLine>

  const featured = selectFeaturedProjects(projects)
  const newest = projects.filter((p) => !featured.includes(p)).sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
  const shown = [...featured, ...newest].slice(0, PROJECT_COUNT)
  return (
    <>
      <ul role="list">
        {shown.map((project) => (
          <Row key={project.id} href={`/project/${project.id}`} title={project.title}>
            {firstSentence(project.description)}
          </Row>
        ))}
      </ul>
      {projects.length > shown.length && (
        <p className="mt-3 text-body">
          <InkLink href="/project" event="cta-click" eventData={{ target: "projects" }}>
            All {projects.length} projects
          </InkLink>
        </p>
      )}
    </>
  )
}

async function Writing() {
  const posts = (await getPosts().catch(() => [])).slice(0, 5)
  if (posts.length === 0) return <StatusLine kind="failed">No writing could be fetched just now. It is on DEV Community and Medium too.</StatusLine>
  return (
    <>
      <ul role="list">
        {posts.map((post) => (
          <Row key={post.id} href={post.href} external={post.source === "medium"} title={post.title}>
            {firstSentence(post.excerpt)}
          </Row>
        ))}
      </ul>
      <p className="mt-3 text-body">
        <InkLink href="/blog" event="cta-click" eventData={{ target: "writing" }}>
          All writing
        </InkLink>
      </p>
    </>
  )
}

/** Every role and study, newest first. */
async function Work() {
  const [career, education] = await Promise.allSettled([getAllCarrer(), getAllEducation()])
  const fulfilled = <T,>(result: PromiseSettledResult<T[] | null>) => (result.status === "fulfilled" ? (result.value ?? []) : [])
  const entries = [...fulfilled(career), ...fulfilled(education)].sort((a, b) => startOf(b.duration) - startOf(a.duration))
  if (entries.length === 0) return <StatusLine kind="failed">Work history did not load just now. It is all in the CV.</StatusLine>
  return (
    <ul role="list">
      {entries.map((entry) => (
        <Row key={entry.id} title={entry.title}>
          {[entry.subtitle.trim(), entry.duration.replace(" - ", " to ")].filter(Boolean).join(", ")}
        </Row>
      ))}
    </ul>
  )
}

/** Every recommendation LinkedIn returns; the section is left out when there are none. */
async function Recommendations() {
  const { data } = await getLinkedinRecommendations().catch(() => ({ data: null }))
  const quotes = (data ?? []).filter((rec) => rec.message?.trim())
  if (quotes.length === 0) return null
  return (
    <Section id="recommendations" title="Recommendations">
      <div className="space-y-6">
        {quotes.map((rec) => (
          <figure key={rec.id}>
            <blockquote className="text-body text-muted-foreground">{rec.message.trim()}</blockquote>
            <figcaption className="mt-2 text-small text-foreground">{rec.name}, on LinkedIn</figcaption>
          </figure>
        ))}
      </div>
    </Section>
  )
}

export default function Home() {
  return (
    <BaseLayout>
      <h1 className="sr-only">Rizky Haksono</h1>
      <Bio />

      <Section id="projects" title="Projects">
        <Suspense fallback={<RowsSkeleton rows={5} />}>
          <Projects />
        </Suspense>
      </Section>

      <Section id="writing" title="Writing">
        <Suspense fallback={<RowsSkeleton rows={4} />}>
          <Writing />
        </Suspense>
      </Section>

      <Section id="work" title="Work experience">
        <Suspense fallback={<RowsSkeleton rows={4} />}>
          <Work />
        </Suspense>
      </Section>

      <Suspense fallback={null}>
        <Recommendations />
      </Suspense>

      <Section id="contact" title="Contact">
        <p className="text-body text-muted-foreground">
          Write to me at{" "}
          <InkLink href={`mailto:${EMAIL}`} event="email-click" eventData={{ area: "contact" }} className="break-all">
            {EMAIL}
          </InkLink>
          .
        </p>
        <details className="group mt-3">
          <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 text-body text-muted-foreground transition-colors hover:text-foreground md:min-h-0 [&::-webkit-details-marker]:hidden">
            <span aria-hidden className="inline-block transition-transform duration-ui ease-out group-open:rotate-90">
              ›
            </span>
            Or leave a message here
          </summary>
          <div className="mt-4">
            <ContactForm />
          </div>
        </details>
      </Section>
    </BaseLayout>
  )
}
