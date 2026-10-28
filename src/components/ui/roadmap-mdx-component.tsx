import type { MDXComponents } from "mdx/types"
import type { ComponentProps, ReactNode } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { InkLink } from "@/components/ui/ink-link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import CodeBlock, { Pre } from "./code-block"
import { CopyHeader } from "./copy-header"

interface Heading {
  id: string
  text: string
  depth: number
}

interface MdNode {
  type: string
  depth?: number
  value?: string
  children?: MdNode[]
  data?: { hProperties?: Record<string, unknown> }
}

const textOf = (node: MdNode): string => node.value ?? node.children?.map(textOf).join("") ?? ""
const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")

/**
 * Remark plugin: gives every markdown heading a unique id from its full text (inline code included)
 * and collects the top-level h2 / h3 into `out` for the contents rail.
 */
export function headingIds(out: Heading[]) {
  return () => (tree: MdNode) => {
    const seen = new Map<string, number>()
    const visit = (node: MdNode, top: boolean) => {
      if (node.type === "heading") {
        const text = textOf(node).trim()
        const base = slugify(text) || "section"
        const count = seen.get(base) ?? 0
        seen.set(base, count + 1)
        const id = count ? `${base}-${count}` : base
        node.data = { ...node.data, hProperties: { ...node.data?.hProperties, id } }
        if (top && (node.depth === 2 || node.depth === 3)) out.push({ id, text, depth: node.depth })
      }
      node.children?.forEach((child) => visit(child, false))
    }
    tree.children?.forEach((child) => visit(child, true))
  }
}

interface AsideProps {
  title?: ReactNode
  children?: ReactNode
}

/** A note set off by a left rule: the title is the word that says what kind of note it is. */
function Note({ title, children }: Readonly<AsideProps>) {
  return (
    <div role="note" className="my-6 border-l border-ink pl-4">
      {title && <p className="font-display text-h4 text-ink">{title}</p>}
      <div className="mt-1 [&>*+*]:mt-[0.75em]">{children}</div>
    </div>
  )
}

/** A warning is framed all round, so it differs from a note by shape as well as by word. */
function Warning({ title = "Warning", children }: Readonly<AsideProps>) {
  return (
    <div role="note" className="my-6 border border-ink p-4">
      <p className="font-display text-h4 text-ink">{title}</p>
      <div className="mt-1 [&>*+*]:mt-[0.75em]">{children}</div>
    </div>
  )
}

const Tip = ({ title = "Tip", children }: AsideProps) => <Note title={title}>{children}</Note>
const InfoCard = ({ title = "Note", children }: AsideProps) => <Note title={title}>{children}</Note>

// <Alert><AlertTitle/><AlertDescription/></Alert> in older lessons prints as a note.
const Alert = ({ children }: AsideProps) => <Note>{children}</Note>
const AlertTitle = ({ children }: AsideProps) => <p className="font-display text-h4 text-ink">{children}</p>
const AlertDescription = ({ children }: AsideProps) => <div>{children}</div>

function LearningObjectives({ objectives = [] }: Readonly<{ objectives?: string[] }>) {
  if (objectives.length === 0) return null
  return (
    <section className="my-6 border-y border-rule py-4">
      <p className="font-display text-h4 text-ink">Learning objectives</p>
      <ul className="mt-2">
        {objectives.map((objective) => (
          <li key={objective}>{objective}</li>
        ))}
      </ul>
    </section>
  )
}

interface Resource {
  title: string
  href: string
}

function Resources({ title = "Further reading", resources = [] }: Readonly<{ title?: string; resources?: Resource[] }>) {
  if (resources.length === 0) return null
  return (
    <section className="my-6">
      <p className="font-display text-h4 text-ink">{title}</p>
      <ul className="mt-2">
        {resources.map((resource) => (
          <li key={resource.href}>
            <InkLink href={resource.href} external>
              {resource.title}
            </InkLink>
          </li>
        ))}
      </ul>
    </section>
  )
}

function NextLesson({ title, description, href }: Readonly<{ title: string; description?: string; href?: string }>) {
  return (
    <div className="my-8 border-t border-ink pt-4">
      <p className="font-display text-caption text-ink-soft">Next lesson</p>
      <p className="font-display text-h3 text-ink">{href ? <InkLink href={href}>{title}</InkLink> : title}</p>
      {description && <p className="mt-1 text-ink-soft">{description}</p>}
    </div>
  )
}

const CodeSnippet = ({ children, language = "javascript" }: { children?: ReactNode; language?: string }) => (
  <Pre>
    <code className={`language-${language}`}>{typeof children === "string" ? children : String(children ?? "")}</code>
  </Pre>
)

// `.prose` sets tables full width; wide ones scroll sideways inside this box instead of the page.
export const Table = (props: ComponentProps<"table">) => (
  <div className="my-6 w-full overflow-x-auto">
    <table {...props} />
  </div>
)

const heading = (level: 1 | 2 | 3 | 4 | 5 | 6) => {
  const Heading = (props: ComponentProps<"h2">) => <CopyHeader level={level} {...props} />
  Heading.displayName = `Heading${level}`
  return Heading
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    pre: Pre,
    code: CodeBlock,
    table: Table,
    // Block components get vertical rhythm so they don't sit tight against headings and prose.
    // Radix wraps each trigger in an h3; `[&_h3]:mt-0` keeps `.prose h3` spacing off the rows.
    Accordion: (props: ComponentProps<typeof Accordion>) => <Accordion {...props} className={cn("my-6 [&_h3]:mt-0", props.className)} />,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Card: (props: ComponentProps<typeof Card>) => <Card {...props} className={cn("my-6", props.className)} />,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Alert,
    AlertDescription,
    AlertTitle,
    Tabs: (props: ComponentProps<typeof Tabs>) => <Tabs {...props} className={cn("my-6", props.className)} />,
    TabsContent,
    TabsList: (props: ComponentProps<typeof TabsList>) => <TabsList {...props} className={cn("flex-wrap gap-x-5 overflow-x-visible", props.className)} />,
    TabsTrigger,
    CodeSnippet,
    NextLesson,
    Resources,
    LearningObjectives,
    Tip,
    Warning,
    InfoCard,
    h1: heading(1),
    h2: heading(2),
    h3: heading(3),
    h4: heading(4),
    h5: heading(5),
    h6: heading(6),
    ...components,
  }
}
