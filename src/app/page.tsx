import { Suspense, type ReactNode } from "react"
import Image from "next/image"
import { Briefcase, FileText, GraduationCap, Link2, Mail, MapPin } from "lucide-react"
import BaseLayout from "@/components/layout/base-layout"
import { InkLink } from "@/components/ui/ink-link"
import { LedgerList, LedgerRow } from "@/components/ui/ledger"
import { Gallery, MediaCard } from "@/components/ui/media-card"
import { Properties } from "@/components/ui/properties"
import { Skeleton } from "@/components/ui/skeleton"
import { PageCover } from "@/components/ui/page-cover"
import { Mention } from "@/app/_components/home/mention"
import cover from "@/assets/cover/home.webp"
import { StatusLine } from "@/components/ui/status-line"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDay } from "@/app/_components/blog/format"
import { plateOf } from "@/app/(visitor)/project/project-links"
import { cn } from "@/lib/utils"
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
import { runSpans } from "@/lib/run-spans"

export const revalidate = 900

const GITHUB = media_socials.find(({ title }) => title === "GitHub")!.href
const LINKEDIN = media_socials.find(({ title }) => title === "LinkedIn")!.href
const PROJECT_COUNT = 6

/** The first sentence of a description, so every row stays one quiet line. */
const firstSentence = (text: string) => plainText(text).split(/(?<=[.!?])\s/)[0] ?? ""

function Section({ id, title, children }: Readonly<{ id: string; title: string; children: ReactNode }>) {
  return (
    <section aria-labelledby={id} className="mt-12">
      <h2 id={id} className="text-h2 text-foreground">
        {title}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  )
}

function CardsSkeleton() {
  return (
    <div aria-hidden className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
      {Array.from({ length: 3 }, (_, i) => (
        <Skeleton key={i} className="aspect-[16/13] rounded-lg" />
      ))}
    </div>
  )
}

function RowsSkeleton({ rows }: Readonly<{ rows: number }>) {
  return (
    <div aria-hidden className="space-y-3 py-1">
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-5 w-4/5" />
      ))}
    </div>
  )
}

/** The cover's page icon, title and properties: who, where, and how to reach me. */
function Intro() {
  const link = "text-foreground"
  return (
    <header>
      <Image
        src="/rizky.jpg"
        alt=""
        width={112}
        height={112}
        priority
        className="relative -mt-12 size-24 rounded-full border-4 border-background object-cover sm:-mt-14 sm:size-28"
      />
      <h1 className="mt-3 text-title text-foreground sm:text-display">Rizky Haksono</h1>
      <Properties
        className="mt-5"
        items={[
          { icon: <Briefcase strokeWidth={1.5} />, label: "Role", value: "Senior AI engineer at Sarana AI" },
          { icon: <MapPin strokeWidth={1.5} />, label: "Based in", value: "Malang, East Java" },
          {
            icon: <Mail strokeWidth={1.5} />,
            label: "Email",
            value: (
              <InkLink href={`mailto:${EMAIL}`} event="email-click" eventData={{ area: "bio" }} className={cn(link, "break-all")}>
                {EMAIL}
              </InkLink>
            ),
          },
          {
            icon: <Link2 strokeWidth={1.5} />,
            label: "Elsewhere",
            value: (
              <span className="flex flex-wrap gap-x-3">
                <InkLink href={GITHUB} external event="social-click" eventData={{ network: "github", area: "bio" }}>
                  GitHub
                </InkLink>
                <InkLink href={LINKEDIN} external event="social-click" eventData={{ network: "linkedin", area: "bio" }}>
                  LinkedIn
                </InkLink>
                <InkLink href={RESUME_GOOGLE_DRIVE_URL} external event="resume-open" eventData={{ area: "bio" }}>
                  CV
                </InkLink>
              </span>
            ),
          },
        ]}
      />
    </header>
  )
}

type Project = Awaited<ReturnType<typeof getAllProject>>[number]

/** Who and what, as plain page text. With the projects loaded, the names become Notion mentions with a preview. */
function BioText({ projects }: Readonly<{ projects?: Project[] }>) {
  const project = (name: string) => projects?.find((p) => p.title.toLowerCase().includes(name.toLowerCase()))
  const work = (name: string, text: string) => {
    const found = project(name)
    if (!found) return text
    return (
      <Mention href={`/project/${found.id}`} image={plateOf(found)} icon={<Briefcase />} title={found.title} description={firstSentence(found.description)}>
        {text}
      </Mention>
    )
  }

  return (
    <div className="mt-6 space-y-3 border-t border-border pt-6 text-body text-pretty text-foreground">
      <p>
        Senior AI engineer at{" "}
        {projects ? (
          <Mention href="#work" icon={<Briefcase />} title="Sarana AI" description="Where I work now: retrieval and embeddings, MCP integrations and agents on AWS.">
            Sarana AI
          </Mention>
        ) : (
          "Sarana AI"
        )}{" "}
        in Malang, East Java, building LLM systems for production: retrieval and embeddings, MCP integrations, and agents that
        run on AWS.
      </p>
      <p>
        I ship end-to-end products in Next.js, Go and Python, from {work("Info Pangan", "Info Pangan Jakarta")}, the city&apos;s
        official food price monitor, to platforms for {work("Adaro", "Adaro")} and {work("Biofarma", "Biofarma")}, with CI/CD I
        can rely on.
      </p>
      <p>
        I studied informatics at{" "}
        {projects ? (
          <Mention href="#education" icon={<GraduationCap />} title="Universitas Muhammadiyah Malang" description="Informatics, graduated cum laude.">
            Universitas Muhammadiyah Malang
          </Mention>
        ) : (
          "Universitas Muhammadiyah Malang"
        )}{" "}
        and graduated cum laude.
      </p>
    </div>
  )
}

async function Bio() {
  const projects = await getAllProject().catch(() => undefined)
  return <BioText projects={projects ?? undefined} />
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
      <Gallery>
        {shown.map((project) => (
          <li key={project.id}>
            <MediaCard
              href={`/project/${project.id}`}
              image={plateOf(project)}
              title={project.title}
              description={firstSentence(project.description)}
              meta={project.created_at ? new Date(project.created_at).getFullYear() : undefined}
            />
          </li>
        ))}
      </Gallery>
      {projects.length > shown.length && (
        <p className="mt-3 text-small">
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
      <LedgerList>
        {posts.map((post) => (
          <LedgerRow
            key={post.id}
            href={post.href}
            external={post.source === "medium"}
            icon={<FileText />}
            title={post.title}
            meta={post.date ? formatDay(post.date) : undefined}
          />
        ))}
      </LedgerList>
      <p className="mt-3 text-small">
        <InkLink href="/blog" event="cta-click" eventData={{ target: "writing" }}>
          All writing
        </InkLink>
      </p>
    </>
  )
}

type Entry = { id: string | number; title: string; subtitle: string; duration: string }

/** A Notion table of records; the rows keep the organisation in `title` and the role or study in `subtitle`. */
function RecordTable({ entries, first, second }: Readonly<{ entries: Entry[]; first: string; second: string }>) {
  // Back-to-back roles at one company share a merged company cell.
  const spans = runSpans(entries, (entry) => entry.title.trim().toLowerCase())
  return (
    <div className="-mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0">
      <Table className="min-w-[34rem]">
        <TableHeader>
          <TableRow>
            <TableHead>{first}</TableHead>
            <TableHead>{second}</TableHead>
            <TableHead>When</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry, i) => (
            <TableRow key={entry.id}>
              <TableCell className="font-medium text-foreground">{entry.subtitle.trim() || entry.title}</TableCell>
              {spans[i] > 0 && (
                <TableCell rowSpan={spans[i]} className="text-muted-foreground">
                  {entry.title}
                </TableCell>
              )}
              <TableCell className="whitespace-nowrap text-muted-foreground">{entry.duration.replace(" - ", " to ")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

const newestFirst = <T extends { duration: string }>(rows: T[]) => [...rows].sort((a, b) => startOf(b.duration) - startOf(a.duration))

/** Every role, newest first. */
async function Work() {
  const career = await getAllCarrer().catch(() => null)
  if (!career?.length) return <StatusLine kind="failed">Work history did not load just now. It is all in the CV.</StatusLine>
  return <RecordTable entries={newestFirst(career)} first="Role" second="Company" />
}

/** Every study, newest first. */
async function Education() {
  const education = await getAllEducation().catch(() => null)
  if (!education?.length) return <StatusLine kind="failed">Education did not load just now. It is in the CV.</StatusLine>
  return <RecordTable entries={newestFirst(education)} first="Study" second="School" />
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
          <figure key={rec.id} className="border-l-[3px] border-foreground pl-3.5">
            <blockquote className="text-body text-foreground">{rec.message.trim()}</blockquote>
            <figcaption className="mt-2 text-small text-muted-foreground">{rec.name}, on LinkedIn</figcaption>
          </figure>
        ))}
      </div>
    </Section>
  )
}

export default function Home() {
  return (
    <BaseLayout cover={<PageCover src={cover} />}>
      <Intro />
      <Suspense fallback={<BioText />}>
        <Bio />
      </Suspense>

      <Section id="projects" title="Projects">
        <Suspense fallback={<CardsSkeleton />}>
          <Projects />
        </Suspense>
      </Section>

      <Section id="writing" title="Writing">
        <Suspense fallback={<RowsSkeleton rows={5} />}>
          <Writing />
        </Suspense>
      </Section>

      <Section id="work" title="Work experience">
        <Suspense fallback={<RowsSkeleton rows={6} />}>
          <Work />
        </Suspense>
      </Section>

      <Section id="education" title="Education">
        <Suspense fallback={<RowsSkeleton rows={3} />}>
          <Education />
        </Suspense>
      </Section>

      <Suspense fallback={null}>
        <Recommendations />
      </Suspense>

      <Section id="contact" title="Contact">
        <p className="mb-4 text-body text-foreground">
          Write to me at{" "}
          <InkLink href={`mailto:${EMAIL}`} event="email-click" eventData={{ area: "contact" }} className="break-all">
            {EMAIL}
          </InkLink>
          , or send a message here.
        </p>
        <ContactForm />
      </Section>
    </BaseLayout>
  )
}
