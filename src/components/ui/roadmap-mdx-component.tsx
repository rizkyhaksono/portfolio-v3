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

export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    img: ({ className, ...props }: React.ComponentProps<"img">) => <img className={cn("rounded-md border", className)} {...props} />,
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
