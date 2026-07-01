"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"

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

const PAGES = ["/", "/project", "/blog", "/ai", "/chat", "/tracker", "/tools", "/roadmap", "/stats", "/status", "/certificates", "/changelog"]
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
    run: () => ["Muhammad Rizky Haksono", "Software / AI Engineer — RAG, LLMs, multi-cloud.", "Type `socials` to connect, `open /project` to see my work."],
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
      return ["Ask my resume → opening Etan AI…"]
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
      return [`theme → ${t}`]
    },
  },
  { name: "echo", description: "Print text", run: (args) => [args.join(" ")] },
  { name: "clear", description: "Clear the screen", run: (_a, ctx) => ctx.clear() },
  { name: "exit", description: "Close the terminal", run: (_a, ctx) => ctx.close() },
  { name: "sudo", description: "Nice try", run: () => ["Permission denied: nice try 😏"] },
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
  const boxRef = useRef<HTMLDivElement>(null)

  // Backtick toggles; Escape closes. Ignore backtick while typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        return
      }
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
    if (open) setTimeout(() => inputRef.current?.focus(), 0)
  }, [open])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [lines, open])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [open])

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

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[10001] flex items-start justify-center bg-black/40 p-4 pt-[12vh] print:hidden">
      <div
        ref={boxRef}
        className="flex h-[60vh] max-h-[520px] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-border/60 bg-[#0c0c0c] shadow-2xl"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="flex shrink-0 items-center gap-3 border-b border-white/10 bg-white/5 px-4 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-400/90" />
            <span className="h-3 w-3 rounded-full bg-yellow-400/90" />
            <span className="h-3 w-3 rounded-full bg-green-400/90" />
          </div>
          <p className="flex-1 truncate text-center font-mono text-xs text-white/50">rizky@portfolio ~ terminal</p>
          <button onClick={() => setOpen(false)} className="font-mono text-xs text-white/40 hover:text-white/80" aria-label="Close terminal">esc</button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 font-mono text-[13px] leading-relaxed text-green-300/90">
          {lines.map((l, i) => (
            <div key={i} className={cn("whitespace-pre-wrap break-words", l.kind === "in" && "text-white/90")}>
              {l.kind === "in" ? `$ ${l.text}` : l.text}
            </div>
          ))}
          <div className="mt-1 flex items-center gap-2">
            <span className="text-white/60">$</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              className="flex-1 bg-transparent font-mono text-[13px] text-white/90 outline-none"
              aria-label="Terminal input"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
