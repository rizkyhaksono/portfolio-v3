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
import { toast } from "sonner"
import type { SearchDoc, SearchDocType } from "@/lib/search-index"
import { NAV_SECTIONS } from "@/commons/constants/navigation-menu"

const navItems = [{ href: "/", label: "Home" }, ...NAV_SECTIONS]

const typeLabel: Record<SearchDocType, string> = {
  page: "Pages",
  blog: "Writing",
  project: "Projects",
  roadmap: "Roadmap",
  changelog: "Changelog",
}

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCloseAutoFocus?: (event: Event) => void
}

/** Controlled by DeferredClientUtilities, which owns ⌘K and the search buttons. */
export function CommandPalette({ open, onOpenChange: setOpen, onCloseAutoFocus }: Readonly<CommandPaletteProps>) {
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
      // No custom extractField: it also feeds storeFields, and stored tags must stay an array.
      // The default stringifyField turns ["a", "b"] into "a,b", which the tokenizer splits.
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
      page: [],
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
    <CommandDialog className="max-sm:mt-4 max-sm:w-[calc(100%-40px)]" open={open} onOpenChange={setOpen} onCloseAutoFocus={onCloseAutoFocus}>
      <CommandInput
        placeholder="Search pages and posts"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>
          {loading ? "Loading the index…" : "Nothing matches that search."}
        </CommandEmpty>

        {query.trim() && results.length > 0 && (
          <>
            {(Object.keys(groupedResults) as SearchDocType[]).map((type) => {
              const items = groupedResults[type]
              if (items.length === 0) return null
              return (
                <CommandGroup key={type} heading={typeLabel[type]}>
                  {items.map((doc) => (
                    <CommandItem
                      key={doc.id}
                      value={`${doc.title} ${doc.description} ${doc.tags.join(" ")}`}
                      onSelect={() => runCommand(() => router.push(doc.url))}
                    >
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
            <span>Paper theme</span>
          </CommandItem>
          <CommandItem value="theme dark" onSelect={() => runCommand(() => setTheme("dark"))}>
            <span>Night theme</span>
          </CommandItem>
          <CommandItem value="theme system" onSelect={() => runCommand(() => setTheme("system"))}>
            <span>System theme</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Links">
          <CommandItem
            value="github profile"
            onSelect={() => runCommand(() => window.open("https://github.com/rizkyhaksono", "_blank", "noopener,noreferrer"))}
          >
            <span>Open GitHub</span>
          </CommandItem>
          <CommandItem
            value="linkedin profile"
            onSelect={() => runCommand(() => window.open("https://linkedin.com/in/rizkyhaksono", "_blank", "noopener,noreferrer"))}
          >
            <span>Open LinkedIn</span>
          </CommandItem>
          <CommandItem
            value="copy email"
            onSelect={() => runCommand(() => copyToClipboard("mrizkyhaksono@gmail.com", "Email"))}
          >
            <span>Copy email</span>
            <CommandShortcut>mrizkyhaksono@gmail.com</CommandShortcut>
          </CommandItem>
          <CommandItem
            value="copy current url"
            onSelect={() => runCommand(() => copyToClipboard(window.location.href, "URL"))}
          >
            <span>Copy current URL</span>
          </CommandItem>
          <CommandItem
            value="rss feed"
            onSelect={() => runCommand(() => window.location.assign("/feed.xml"))}
          >
            <span>RSS feed</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
