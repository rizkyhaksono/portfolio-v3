"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { JOB_TITLE } from "@/commons/constants/author"
import { NAV_SECTIONS } from "@/commons/constants/navigation-menu"

type Line = { kind: "in" | "out"; text: string }

interface TerminalCtx {
  print: (lines: string[]) => void
  clear: () => void
  navigate: (path: string) => void
  setTheme: (t: string) => void
  close: () => void
}

interface Command {
  name: string
  usage?: string
  description: string
  run: (args: string[], ctx: TerminalCtx) => string[] | void
}

const PAGES = ["/", ...NAV_SECTIONS.map((section) => section.href)]
const SOCIALS: Record<string, string> = {
  github: "https://github.com/rizkyhaksono",
  linkedin: "https://linkedin.com/in/rizkyhaksono",
  email: "mrizkyhaksono@gmail.com",
}

const COMMANDS: Command[] = [
  {
    name: "help",
    description: "List available commands",
    run: () => [
      "Available commands:",
      ...COMMANDS.map((c) => `  ${c.name.padEnd(10)} ${c.description}`),
      "",
      "Tip: `open /project`, `theme dark`, `ls socials`",
    ],
  },
  {
    name: "whoami",
    description: "About me",
    run: () => ["Muhammad Rizky Haksono", `${JOB_TITLE} — RAG, LLMs, multi-cloud.`, "Type `socials` to connect, `open /project` to see my work."],
  },
  {
    name: "ls",
    usage: "ls [pages|socials]",
    description: "List pages or socials",
    run: (args) => {
      if (args[0] === "socials") return Object.entries(SOCIALS).map(([k, v]) => `  ${k.padEnd(10)} ${v}`)
      return ["pages:", ...PAGES.map((p) => `  ${p}`)]
    },
  },
  {
    name: "open",
    usage: "open <path>",
    description: "Navigate to a page (e.g. open /ai)",
    run: (args, ctx) => {
      const raw = args[0]
      if (!raw) return ["usage: open <path>"]
      const path = raw.startsWith("/") ? raw : `/${raw}`
      ctx.navigate(path)
      return [`opening ${path}…`]
    },
  },
  {
    name: "cd",
    usage: "cd <path>",
    description: "Alias for open",
    run: (args, ctx) => COMMANDS.find((c) => c.name === "open")!.run(args, ctx),
  },
  {
    name: "resume",
    description: "Open my resume",
    run: (_a, ctx) => {
      ctx.navigate("/ai")
      return ["Opening Etan AI, which answers from my résumé…"]
    },
  },
  {
    name: "socials",
    description: "Show my links",
    run: () => Object.entries(SOCIALS).map(([k, v]) => `  ${k.padEnd(10)} ${v}`),
  },
  {
    name: "theme",
    usage: "theme <light|dark|system>",
    description: "Switch theme",
    run: (args, ctx) => {
      const t = args[0]
      if (t !== "light" && t !== "dark" && t !== "system") return ["usage: theme <light|dark|system>"]
      ctx.setTheme(t)
      return [`Theme set to ${t}.`]
    },
  },
  { name: "echo", description: "Print text", run: (args) => [args.join(" ")] },
  { name: "clear", description: "Clear the screen", run: (_a, ctx) => ctx.clear() },
  { name: "exit", description: "Close the terminal", run: (_a, ctx) => ctx.close() },
  { name: "sudo", description: "Nice try", run: () => ["Permission denied. Nice try."] },
]

const WELCOME: Line[] = [
  { kind: "out", text: "rizky-os v3 — type `help` to begin, `exit` to close." },
]

export default function TerminalOverlay() {
  const [open, setOpen] = useState(false)
  const [lines, setLines] = useState<Line[]>(WELCOME)
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const router = useRouter()
  const { setTheme } = useTheme()
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const returnFocusRef = useRef<HTMLElement | null>(null)

  // Backtick toggles (Radix handles Escape, outside clicks and the focus trap). Ignore backtick while typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      const typing = !!el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable)
      if (e.key === "`" && !typing) {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [lines])

  const run = useCallback(
    (raw: string) => {
      const cmd = raw.trim()
      setLines((prev) => [...prev, { kind: "in", text: cmd }])
      if (!cmd) return
      setHistory((prev) => [...prev, cmd])
      setHistIdx(-1)

      const [name, ...args] = cmd.split(/\s+/)
      const command = COMMANDS.find((c) => c.name === name.toLowerCase())
      const ctx: TerminalCtx = {
        print: (out) => setLines((prev) => [...prev, ...out.map((text) => ({ kind: "out" as const, text }))]),
        clear: () => setLines([]),
        navigate: (path) => {
          router.push(path)
          setOpen(false)
        },
        setTheme,
        close: () => setOpen(false),
      }

      if (!command) {
        setLines((prev) => [...prev, { kind: "out", text: `command not found: ${name} — try \`help\`` }])
        return
      }
      const out = command.run(args, ctx)
      if (Array.isArray(out)) setLines((prev) => [...prev, ...out.map((text) => ({ kind: "out" as const, text }))])
    },
    [router, setTheme],
  )

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(input)
      setInput("")
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (history.length === 0) return
      const idx = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1)
      setHistIdx(idx)
      setInput(history[idx] ?? "")
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (histIdx === -1) return
      const idx = histIdx + 1
      if (idx >= history.length) {
        setHistIdx(-1)
        setInput("")
      } else {
        setHistIdx(idx)
        setInput(history[idx] ?? "")
      }
    }
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[10001] bg-[hsl(var(--scrim,var(--ink)/.35))] print:hidden" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          onOpenAutoFocus={(e) => {
            // No Radix trigger here (backtick opens it), so remember where focus was and give it back on close.
            returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
            e.preventDefault()
            inputRef.current?.focus()
            if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
          }}
          onCloseAutoFocus={(e) => {
            e.preventDefault()
            returnFocusRef.current?.focus({ preventScroll: true })
          }}
          onClick={() => inputRef.current?.focus()}
          className="fixed inset-x-4 top-[12vh] z-[10001] mx-auto flex h-[60vh] max-h-[520px] max-w-2xl flex-col border border-ink bg-paper text-ink shadow-[3px_3px_0_hsl(var(--ink))] print:hidden"
        >
          <div className="flex shrink-0 items-center justify-between border-b border-rule pl-4">
            <DialogPrimitive.Title className="font-display text-caption text-ink-soft">Terminal</DialogPrimitive.Title>
            <DialogPrimitive.Close
              aria-label="Close terminal"
              className="inline-flex h-11 w-11 items-center justify-center hover:bg-tint md:h-9 md:w-9"
            >
              <X className="h-5 w-5" strokeWidth={1.5} aria-hidden />
            </DialogPrimitive.Close>
          </div>

          <div ref={scrollRef} role="log" aria-live="polite" className="flex-1 overflow-y-auto p-4 text-[13.5px] leading-relaxed">
            {lines.map((l, i) => (
              <samp key={i} className={cn("block whitespace-pre-wrap break-words", l.kind === "in" && "text-ink-soft")}>
                {l.kind === "in" ? `$ ${l.text}` : l.text}
              </samp>
            ))}
            <div className="mt-1 flex items-center gap-2">
              <samp aria-hidden>$</samp>
              {/* kbd carries the system mono to the input, which inherits its font. */}
              <kbd className="flex flex-1">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  spellCheck={false}
                  autoComplete="off"
                  autoCapitalize="off"
                  className="flex-1 bg-transparent text-base text-ink md:text-[13.5px]"
                  aria-label="Terminal input"
                />
              </kbd>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
