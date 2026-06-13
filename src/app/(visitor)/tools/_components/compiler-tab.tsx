"use client"

import BlurFade from "@/components/magicui/blur-fade"
import { useState, useEffect, useCallback, useRef } from "react"
import { useTheme } from "next-themes"
import {
  Play, Copy, Download, RotateCcw, Check, X,
  Files, Search, Blocks, Settings, GitBranch, Bell, FileCode2,
} from "lucide-react"
import { postExecuteCode } from "@/services/visitor/compiler"
import { LANGUAGES, Theme, themes } from "@/commons/constants/compiler"
import { CompilerCodeEditor } from "./compiler/compiler-code-editor"
import { CompilerTerminal } from "./compiler/compiler-output-panel"

const LANG_META: Record<string, { file: string; cmd: string; ext: string; dot: string }> = {
  javascript: { file: "main.js", cmd: "node main.js", ext: "js", dot: "bg-yellow-400" },
  python: { file: "main.py", cmd: "python main.py", ext: "py", dot: "bg-blue-400" },
  java: { file: "Main.java", cmd: "javac Main.java && java Main", ext: "java", dot: "bg-red-400" },
  cpp: { file: "main.cpp", cmd: "g++ main.cpp -o main && ./main", ext: "cpp", dot: "bg-purple-400" },
  c: { file: "main.c", cmd: "gcc main.c -o main && ./main", ext: "c", dot: "bg-sky-400" },
}

const ACTIVITY_ICONS = [Files, Search, GitBranch, Blocks]

export function CompilerTab() {
  const { resolvedTheme } = useTheme()

  const [language, setLanguage] = useState(LANGUAGES[0].value)
  const [code, setCode] = useState(LANGUAGES[0].defaultCode)
  const [stdin, setStdin] = useState("")
  const [theme, setEditorTheme] = useState<Theme>("tokyo-night")

  const [stdout, setStdout] = useState("")
  const [stderr, setStderr] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [exitCode, setExitCode] = useState<number | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [hasRun, setHasRun] = useState(false)

  const [cursor, setCursor] = useState({ line: 1, col: 1 })
  const [copied, setCopied] = useState(false)
  const themeSynced = useRef(false)

  const meta = LANG_META[language] ?? LANG_META.python
  const selectedLang = LANGUAGES.find((l) => l.value === language)

  // Sync the editor theme to the site theme once, then respect manual selection.
  useEffect(() => {
    if (themeSynced.current || !resolvedTheme) return
    themeSynced.current = true
    setEditorTheme(resolvedTheme === "light" ? "github" : "tokyo-night")
  }, [resolvedTheme])

  const handleLanguageChange = (value: string) => {
    const lang = LANGUAGES.find((l) => l.value === value)
    setLanguage(value)
    setCode(lang?.defaultCode ?? "")
    setStdout(""); setStderr(""); setError(null); setExitCode(null); setTime(null); setHasRun(false)
  }

  const handleRun = useCallback(async () => {
    if (isRunning) return
    setHasRun(true)
    if (!code.trim()) {
      setError("Please enter some code to execute.")
      setExitCode(1)
      return
    }
    setIsRunning(true)
    setError(null); setStdout(""); setStderr(""); setExitCode(null); setTime(null)
    try {
      const res = await postExecuteCode({
        language,
        version: selectedLang?.version,
        code,
        stdin,
      })
      setStdout(res.stdout)
      setStderr(res.stderr)
      setExitCode(res.exitCode)
      setTime(res.time)
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unexpected error occurred.")
      setExitCode(1)
    } finally {
      setIsRunning(false)
    }
  }, [code, language, stdin, selectedLang, isRunning])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault()
        handleRun()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [handleRun])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* ignore */ }
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = meta.file
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setCode(selectedLang?.defaultCode ?? "")
    setStdout(""); setStderr(""); setError(null); setExitCode(null); setTime(null); setHasRun(false)
  }

  const clearTerminal = () => {
    setStdout(""); setStderr(""); setError(null); setExitCode(null); setTime(null); setHasRun(false)
  }

  const runStatus = isRunning
    ? "Running…"
    : hasRun
      ? exitCode === 0 ? "Done" : `Exited (${exitCode})`
      : "Ready"

  return (
    <BlurFade delay={0.25} inView>
      <div className="rounded-xl overflow-hidden border border-[#2b2b2b] shadow-2xl bg-[#1e1e1e] select-none">
        {/* Title bar */}
        <div className="h-9 bg-[#323233] flex items-center px-3 gap-2 border-b border-[#252526]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="mx-auto text-xs text-[#cccccc] flex items-center gap-2">
            <FileCode2 className="w-3.5 h-3.5 text-[#75beff]" />
            {meta.file} — Portfolio Compiler
          </span>
          <select
            value={theme}
            onChange={(e) => setEditorTheme(e.target.value as Theme)}
            title="Editor theme"
            className="bg-[#3c3c3c] text-[#cccccc] text-[11px] rounded px-2 py-0.5 border border-transparent hover:border-[#555] outline-none cursor-pointer"
          >
            {Object.entries(themes).map(([key, t]) => (
              <option key={key} value={key}>{t.name}</option>
            ))}
          </select>
        </div>

        {/* Workbench */}
        <div className="flex h-[68vh] min-h-[460px]">
          {/* Activity bar */}
          <div className="hidden sm:flex w-12 bg-[#333333] flex-col items-center py-3 gap-5 shrink-0">
            {ACTIVITY_ICONS.map((Icon, i) => (
              <Icon key={i} className="w-5 h-5 text-[#858585] hover:text-[#cccccc] cursor-pointer" />
            ))}
            <div className="mt-auto flex flex-col items-center gap-5">
              <Settings className="w-5 h-5 text-[#858585] hover:text-[#cccccc] cursor-pointer" />
            </div>
          </div>

          {/* Editor column */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Tab bar */}
            <div className="h-9 bg-[#252526] flex items-center justify-between border-b border-[#1e1e1e] shrink-0">
              <div className="flex items-center h-full">
                <div className="flex items-center gap-2 h-full px-3 bg-[#1e1e1e] border-t-2 border-t-[#007acc] text-[#e7e7e7] text-xs">
                  <span className={`w-2 h-2 rounded-full ${meta.dot}`} />
                  {meta.file}
                  <X className="w-3.5 h-3.5 text-[#858585] hover:text-white ml-1" />
                </div>
              </div>

              <div className="flex items-center gap-1.5 pr-2">
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="bg-[#3c3c3c] text-[#cccccc] text-xs rounded px-2 py-1 border border-transparent hover:border-[#555] outline-none cursor-pointer"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>

                <button
                  onClick={handleCopy}
                  title="Copy code"
                  className="p-1.5 rounded text-[#a0a0a0] hover:text-white hover:bg-white/10"
                >
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <button onClick={handleDownload} title="Download file" className="p-1.5 rounded text-[#a0a0a0] hover:text-white hover:bg-white/10">
                  <Download className="w-4 h-4" />
                </button>
                <button onClick={handleReset} title="Reset code" className="p-1.5 rounded text-[#a0a0a0] hover:text-white hover:bg-white/10">
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  title="Run (Ctrl/Cmd + Enter)"
                  className="flex items-center gap-1.5 bg-[#16825d] hover:bg-[#1a9c70] disabled:opacity-60 disabled:cursor-not-allowed text-white text-xs font-medium px-3 py-1 rounded ml-1"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  {isRunning ? "Running…" : "Run"}
                </button>
              </div>
            </div>

            {/* Editor + Terminal split */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 min-h-0">
                <CompilerCodeEditor
                  code={code}
                  onChange={setCode}
                  language={language}
                  theme={theme}
                  onCursorChange={(line, col) => setCursor({ line, col })}
                />
              </div>
              <div className="h-[40%] min-h-[170px] border-t border-[#2b2b2b]">
                <CompilerTerminal
                  stdout={stdout}
                  stderr={stderr}
                  error={error}
                  isRunning={isRunning}
                  exitCode={exitCode}
                  time={time}
                  runCommand={meta.cmd}
                  hasRun={hasRun}
                  stdin={stdin}
                  onStdinChange={setStdin}
                  onClear={clearTerminal}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="h-6 bg-[#007acc] text-white text-[11px] flex items-center justify-between px-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" /> main</span>
            <span className={`flex items-center gap-1 ${isRunning ? "animate-pulse" : ""}`}>
              {runStatus}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>Ln {cursor.line}, Col {cursor.col}</span>
            <span>Spaces: 2</span>
            <span>UTF-8</span>
            {time && <span>{time}s</span>}
            <span>{selectedLang?.label}</span>
            <Bell className="w-3 h-3" />
          </div>
        </div>
      </div>
    </BlurFade>
  )
}
