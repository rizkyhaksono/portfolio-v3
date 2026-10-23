"use client"

import { useState, type ReactNode } from "react"
import dynamic from "next/dynamic"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToolSkeleton } from "@/app/(visitor)/tools/_components/tool-status"
import { track } from "@/lib/analytics"
import { setQuery } from "./set-query"

const OcrDemo = dynamic(() => import("./ocr-demo"), { loading: ToolSkeleton })
const JdMatcher = dynamic(() => import("./jd-matcher"), { loading: ToolSkeleton })

const TABS = [
  { id: "chat", label: "Chat" },
  { id: "document", label: "Document reader" },
  { id: "hirefit", label: "Hire fit" },
] as const

type Tab = (typeof TABS)[number]["id"]

const isTab = (value?: string): value is Tab => TABS.some((t) => t.id === value)

/** Cabinet for Etan AI. The chat node is decided on the server (chat or sign-in slip); the two tools load on first
 *  visit and stay mounted, so switching tabs never loses work. The tab lives in `?tab=`. */
export default function AIHub({ chat, initialTab }: Readonly<{ chat: ReactNode; initialTab?: string }>) {
  const [tab, setTab] = useState<Tab>(isTab(initialTab) ? initialTab : "chat")
  const [visited, setVisited] = useState<Tab[]>([tab])

  const select = (value: string) => {
    if (!isTab(value)) return
    setTab(value)
    setVisited((prev) => (prev.includes(value) ? prev : [...prev, value]))
    setQuery("tab", value === "chat" ? undefined : value)
    track("ai-tab", { tab: value })
  }

  const panels: Record<Tab, ReactNode> = { chat, document: <OcrDemo />, hirefit: <JdMatcher /> }

  return (
    <div>
      <header className="pb-8">
        <h1 className="font-display text-h1 text-balance text-ink">Etan AI</h1>
      </header>
      <div aria-hidden className="border-t border-ink" />

      <Tabs value={tab} onValueChange={select} className="mt-6 sm:mt-8">
        <TabsList aria-label="Etan AI tools">
          {TABS.map((t) => (
            <TabsTrigger key={t.id} value={t.id}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((t) => (
          <TabsContent key={t.id} value={t.id} forceMount className="data-[state=inactive]:hidden">
            {visited.includes(t.id) && panels[t.id]}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
