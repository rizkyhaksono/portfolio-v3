"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import MiniSearch, { type SearchResult } from "minisearch"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Coffee,
  Rss,
  BookOpen,
  FileText,
  Sun,
  Moon,
  Monitor,
  Github,
  Linkedin,
  Mail,
  Link as LinkIcon,
  FileCode,
} from "lucide-react"
import { toast } from "sonner"
import type { SearchDoc, SearchDocType } from "@/lib/search-index"
import { NAV_SECTIONS } from "@/commons/constants/navigation-menu"

const navItems = [{ href: "/", label: "Home" }, ...NAV_SECTIONS]

const typeIcon: Record<SearchDocType, React.ComponentType<{ className?: string }>> = {
  blog: Rss,
  project: Coffee,
  roadmap: BookOpen,
  changelog: FileText,
}

const typeLabel: Record<SearchDocType, string> = {
  blog: "Blog",
  project: "Project",
  roadmap: "Roadmap",
  changelog: "Changelog",
}

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Controlled by DeferredClientUtilities, which owns ⌘K and the search buttons. */
export function CommandPalette({ open, onOpenChange: setOpen }: Readonly<CommandPaletteProps>) {
  const [query, setQuery] = React.useState("")
  const [docs, setDocs] = React.useState<SearchDoc[] | null>(null)
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const { setTheme } = useTheme()

  const searchEngine = React.useMemo(() => {
    if (!docs) return null
    const engine = new MiniSearch<SearchDoc>({
      fields: ["title", "description", "tags"],
      storeFields: ["id", "type", "title", "description", "url", "tags", "date"],
      searchOptions: {
        prefix: true,
        fuzzy: 0.2,
        boost: { title: 2 },
      },
      extractField: (doc, field) => {
        const value = doc[field as keyof SearchDoc]
        if (Array.isArray(value)) return value.join(" ")
        return (value as string | undefined) ?? ""
      },
    })
    engine.addAll(docs)
    return engine
  }, [docs])

  React.useEffect(() => {
    if (!open || docs || loading) return
    setLoading(true)
    fetch("/api/search-index")
      .then((res) => res.json())
      .then((json: { docs: SearchDoc[] }) => setDocs(json.docs ?? []))
      .catch(() => setDocs([]))
      .finally(() => setLoading(false))
  }, [open, docs, loading])

  const runCommand = React.useCallback(
    (callback: () => void) => {
      setOpen(false)
      setTimeout(callback, 50)
    },
    [setOpen],
  )

  const results: Array<SearchResult & SearchDoc> = React.useMemo(() => {
    if (!searchEngine || !query.trim()) return []
    return searchEngine.search(query).slice(0, 10) as Array<SearchResult & SearchDoc>
  }, [searchEngine, query])

  const groupedResults = React.useMemo(() => {
    const groups: Record<SearchDocType, Array<SearchResult & SearchDoc>> = {
      blog: [],
      project: [],
      roadmap: [],
      changelog: [],
    }
    for (const item of results) {
      groups[item.type as SearchDocType].push(item)
    }
    return groups
  }, [results])

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied`)
    })
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search pages, blog, projects, roadmap…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {loading ? "Loading search index…" : "No results found."}
        </CommandEmpty>

        {query.trim() && results.length > 0 && (
          <>
            {(Object.keys(groupedResults) as SearchDocType[]).map((type) => {
              const items = groupedResults[type]
              if (items.length === 0) return null
              const Icon = typeIcon[type]
              return (
                <CommandGroup key={type} heading={typeLabel[type]}>
                  {items.map((doc) => (
                    <CommandItem
                      key={doc.id}
                      value={`${doc.title} ${doc.description} ${doc.tags.join(" ")}`}
                      onSelect={() => runCommand(() => router.push(doc.url))}
                    >
                      <Icon className="text-muted-foreground" />
                      <div className="flex flex-col overflow-hidden">
                        <span className="truncate">{doc.title}</span>
                        {doc.description && (
                          <span className="truncate text-xs text-muted-foreground">
                            {doc.description}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            })}
            <CommandSeparator />
          </>
        )}

        <CommandGroup heading="Navigation">
          {navItems.map((item) => (
            <CommandItem
              key={item.href}
              value={`${item.label} ${item.href}`}
              onSelect={() => runCommand(() => router.push(item.href))}
            >
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Theme">
          <CommandItem value="theme light" onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun />
            <span>Paper theme</span>
          </CommandItem>
          <CommandItem value="theme dark" onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon />
            <span>Night theme</span>
          </CommandItem>
          <CommandItem value="theme system" onSelect={() => runCommand(() => setTheme("system"))}>
            <Monitor />
            <span>System theme</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Links">
          <CommandItem
            value="github profile"
            onSelect={() => runCommand(() => window.open("https://github.com/rizkyhaksono", "_blank"))}
          >
            <Github />
            <span>Open GitHub</span>
          </CommandItem>
          <CommandItem
            value="linkedin profile"
            onSelect={() => runCommand(() => window.open("https://linkedin.com/in/rizkyhaksono", "_blank"))}
          >
            <Linkedin />
            <span>Open LinkedIn</span>
          </CommandItem>
          <CommandItem
            value="copy email"
            onSelect={() => runCommand(() => copyToClipboard("mrizkyhaksono@gmail.com", "Email"))}
          >
            <Mail />
            <span>Copy email</span>
            <CommandShortcut>mrizkyhaksono@gmail.com</CommandShortcut>
          </CommandItem>
          <CommandItem
            value="copy current url"
            onSelect={() => runCommand(() => copyToClipboard(window.location.href, "URL"))}
          >
            <LinkIcon />
            <span>Copy current URL</span>
          </CommandItem>
          <CommandItem
            value="rss feed"
            onSelect={() => runCommand(() => router.push("/feed.xml"))}
          >
            <FileCode />
            <span>RSS feed</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
