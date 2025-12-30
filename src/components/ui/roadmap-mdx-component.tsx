import type { MDXComponents } from "mdx/types"
import React from "react"
import { MediaViewer, ImageViewer, VideoViewer } from "./media-viewer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AuthorCard } from "./author.card"
import { getAuthor, type AuthorKey } from "@/commons/constants/author"
import { CopyHeader } from "./copy-header"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { Pre, CodeBlock } from "./code-block-client"
import Link from "next/link"
import {
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  Info,
  Lightbulb,
  Code,
  Code2,
  Terminal,
  Rocket,
  Zap,
  Target,
  Download,
  Copy,
  Check,
  Server,
  Shield,
  Eye,
  MousePointer,
  List,
  Heart,
  FolderTree,
  Package,
  Settings,
  Folder,
  Puzzle,
  Route,
  Layers,
  ArrowRight,
  ExternalLink,
} from "lucide-react"

const createHeading = (level: number) => {
  const Heading = ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
      <CopyHeader level={level} {...props}>
        {children}
      </CopyHeader>
    )
  }

  Heading.displayName = `Heading${level}`
  return Heading
}

interface AuthorProps {
  id: AuthorKey
}

function Author({ id }: AuthorProps) {
  const author = getAuthor(id)
  return <AuthorCard author={author} className="my-8" />
}

// Inline code component
const InlineCode = ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => {
  return (
    <code className={cn("relative rounded bg-muted px-[0.3rem] py-[0.2rem]", "text-sm font-mono font-semibold", "border")} {...props}>
      {children}
    </code>
  )
}

// Custom CodeSnippet component for inline code in cards
const CodeSnippet = ({ children, language = "javascript" }: { children: React.ReactNode; language?: string }) => {
  // Handle both string children and ReactNode
  const codeContent = typeof children === "string" ? children : String(children || "")

  return (
    <div className="relative rounded-lg bg-zinc-950 dark:bg-zinc-900 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
        <span className="text-xs text-zinc-400 font-mono">{language}</span>
      </div>
      <pre className="p-4 overflow-x-auto text-sm m-0">
        <code className="text-zinc-100 font-mono text-sm leading-relaxed whitespace-pre block">{codeContent}</code>
      </pre>
    </div>
  )
}

// Next Lesson Card Component
interface NextLessonProps {
  title: string
  description?: string
  href?: string
}

const NextLesson = ({ title, description, href }: NextLessonProps) => {
  const content = (
    <Card className="my-8 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 hover:border-primary/40 transition-all group">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <BookOpen className="h-5 w-5" />
          Continue Learning
        </CardTitle>
        {description && <CardDescription className="text-foreground/70">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ArrowRight className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Next Lesson</p>
              <p className="font-semibold group-hover:text-primary transition-colors">{title}</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>
      </CardContent>
    </Card>
  )

  if (href) {
    return (
      <Link href={href} className="block no-underline">
        {content}
      </Link>
    )
  }
  return content
}

// Resources Card Component
interface Resource {
  title: string
  href: string
}

interface ResourcesProps {
  title?: string
  resources: Resource[]
}

const Resources = ({ title = "Additional Resources", resources }: ResourcesProps) => {
  return (
    <Card className="my-8 border-blue-200 dark:border-blue-800/50 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <BookOpen className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {resources.map((resource) => (
            <li key={resource.href}>
              <a
                href={resource.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border hover:border-blue-300 dark:hover:border-blue-700 hover:bg-background transition-all group no-underline"
              >
                <ExternalLink className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <span className="text-sm font-medium text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{resource.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

// Learning Objectives Card
interface LearningObjectivesProps {
  objectives: string[]
}

const LearningObjectives = ({ objectives }: LearningObjectivesProps) => {
  return (
    <Card className="my-6 border-green-200 dark:border-green-800/50 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
          <Target className="h-5 w-5" />
          Learning Objectives
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {objectives.map((objective) => (
            <li key={objective} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-green-800 dark:text-green-200">{objective}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

// Tip Card
interface TipProps {
  title?: string
  children: React.ReactNode
}

const Tip = ({ title = "Pro Tip", children }: TipProps) => {
  return (
    <Alert className="my-6 border-amber-200 dark:border-amber-800/50 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20">
      <Lightbulb className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-700 dark:text-amber-300">{title}</AlertTitle>
      <AlertDescription className="text-amber-800 dark:text-amber-200">{children}</AlertDescription>
    </Alert>
  )
}

// Warning Card
interface WarningProps {
  title?: string
  children: React.ReactNode
}

const Warning = ({ title = "Warning", children }: WarningProps) => {
  return (
    <Alert className="my-6 border-red-200 dark:border-red-800/50 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20">
      <AlertCircle className="h-4 w-4 text-red-600" />
      <AlertTitle className="text-red-700 dark:text-red-300">{title}</AlertTitle>
      <AlertDescription className="text-red-800 dark:text-red-200">{children}</AlertDescription>
    </Alert>
  )
}

// Info Card
interface InfoProps {
  title?: string
  children: React.ReactNode
}

const InfoCard = ({ title = "Note", children }: InfoProps) => {
  return (
    <Alert className="my-6 border-blue-200 dark:border-blue-800/50 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertTitle className="text-blue-700 dark:text-blue-300">{title}</AlertTitle>
      <AlertDescription className="text-blue-800 dark:text-blue-200">{children}</AlertDescription>
    </Alert>
  )
}

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    img: ({ className, alt, ...props }: React.ComponentProps<"img">) => <img className={cn("rounded-md border", className)} alt={alt || ""} {...props} />,
    pre: Pre,
    code: CodeBlock,
    MediaViewer,
    ImageViewer,
    VideoViewer,
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    Author,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Alert,
    AlertDescription,
    AlertTitle,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    // Custom roadmap components
    CodeSnippet,
    NextLesson,
    Resources,
    LearningObjectives,
    Tip,
    Warning,
    InfoCard,
    // Lucide icons
    BookOpen,
    Clock,
    CheckCircle2,
    AlertCircle,
    Info,
    Lightbulb,
    Code,
    Code2,
    Terminal,
    Rocket,
    Zap,
    Target,
    Download,
    Copy,
    Check,
    Server,
    Shield,
    Eye,
    MousePointer,
    List,
    Heart,
    FolderTree,
    Package,
    Settings,
    Folder,
    Puzzle,
    Route,
    Layers,
    ArrowRight,
    ExternalLink,
    h1: createHeading(1),
    h2: createHeading(2),
    h3: createHeading(3),
    h4: createHeading(4),
    h5: createHeading(5),
    h6: createHeading(6),
    ...components,
  }
}

export const useMDXComponents = getMDXComponents
