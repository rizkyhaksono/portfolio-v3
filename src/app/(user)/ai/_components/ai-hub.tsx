"use client"

import { useState, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { MacWindow } from "@/components/ui/mac-window"
import { MessageSquare, ScanText, CatIcon, Target } from "lucide-react"
import JdMatcher from "./jd-matcher"

const TABS = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "document", label: "Document AI", icon: ScanText },
  { id: "hirefit", label: "Hire Fit", icon: Target },
] as const

type Mode = (typeof TABS)[number]["id"]

/** Unified AI hub: one page, a [Chat | Document AI] toggle. The actual chat node is decided
 * server-side (Etan AI when signed in, public RAG when logged out) and passed in. Both modes
 * stay mounted so switching tabs never loses an in-progress conversation. */
export default function AIHub({ chat, docTool, loggedIn }: { chat: ReactNode; docTool: ReactNode; loggedIn: boolean }) {
  const [mode, setMode] = useState<Mode>("chat")

  return (
    <div>
      <div className="mb-5 text-center">
        <h1 className="flex items-center justify-center gap-2 text-2xl font-bold tracking-tight sm:text-3xl">
          <CatIcon className="h-6 w-6 text-primary" />
          Etan AI
        </h1>
        <p className="mx-auto mt-1 max-w-xl text-sm text-muted-foreground">
          Chat with my portfolio assistant — or try the document AI.{" "}
          {loggedIn ? "Your conversations are saved." : "Sign in to save your chats & history."}
        </p>
      </div>

      <div className="mb-5 flex justify-center">
        <div className="inline-flex rounded-none border border-border/60 bg-muted/30 p-0.5">
          {TABS.map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                onClick={() => setMode(t.id)}
                className={cn(
                  "flex items-center gap-1.5 rounded-none px-4 py-1.5 text-sm font-medium transition-colors",
                  mode === t.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
                aria-pressed={mode === t.id}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      <div className={cn(mode !== "chat" && "hidden")}>{chat}</div>
      <div className={cn(mode !== "document" && "hidden")}>{docTool}</div>
      <div className={cn(mode !== "hirefit" && "hidden")}>
        <MacWindow title="etan-ai ~ hire-fit" bodyClassName="p-3 sm:p-5">
          <JdMatcher />
        </MacWindow>
      </div>
    </div>
  )
}
