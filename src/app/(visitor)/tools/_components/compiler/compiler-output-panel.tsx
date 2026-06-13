"use client"

import { useEffect, useRef, useState } from "react";
import { Trash2, Copy, Check, ChevronRight, TerminalSquare } from "lucide-react";

// VSCode-terminal-style syntax coloring for program stdout.
const TOKEN_RE = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`|\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b|\b(?:true|false|null|undefined|NaN|Infinity)\b|[{}[\]()])/gi;

function colorizeOutput(text: string) {
  return text.split(TOKEN_RE).map((part, i) => {
    if (!part) return null;
    let cls = "";
    if (/^["'`]/.test(part)) cls = "text-[#ce9178]"; // strings → orange
    else if (/^\d+(\.\d+)?(e[+-]?\d+)?$/i.test(part)) cls = "text-[#dcdcaa]"; // numbers → yellow
    else if (/^(true|false|null|undefined|nan|infinity)$/i.test(part)) cls = "text-[#569cd6]"; // keywords → blue
    else if (/^[{}[\]()]$/.test(part)) cls = "text-[#e5c07b]"; // brackets → gold
    return (
      <span key={i} className={cls || undefined}>
        {part}
      </span>
    );
  });
}

interface CompilerTerminalProps {
  stdout: string;
  stderr: string;
  error: string | null;
  isRunning: boolean;
  exitCode: number | null;
  time: string | null;
  runCommand: string;
  hasRun: boolean;
  stdin: string;
  onStdinChange: (value: string) => void;
  onClear: () => void;
}

export function CompilerTerminal({
  stdout,
  stderr,
  error,
  isRunning,
  exitCode,
  time,
  runCommand,
  hasRun,
  stdin,
  onStdinChange,
  onClear,
}: Readonly<CompilerTerminalProps>) {
  const [tab, setTab] = useState<"terminal" | "stdin">("terminal");
  const [copied, setCopied] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [stdout, stderr, error, isRunning, exitCode, tab]);

  const handleCopy = async () => {
    const content = error ?? [stdout, stderr].filter(Boolean).join("\n");
    if (!content) return;
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const TabButton = ({ id, label }: { id: "terminal" | "stdin"; label: string }) => (
    <button
      onClick={() => setTab(id)}
      className={`px-3 h-full text-[11px] uppercase tracking-wide transition-colors border-t-2 ${
        tab === id
          ? "border-t-[#007acc] text-[#e7e7e7]"
          : "border-t-transparent text-[#8a8a8a] hover:text-[#cccccc]"
      }`}
    >
      {label}
      {id === "stdin" && stdin ? <span className="ml-1 text-[#007acc]">●</span> : null}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] text-[#cccccc]">
      {/* Panel header / tabs */}
      <div className="flex items-center justify-between h-9 px-1 border-b border-[#2b2b2b] bg-[#252526] shrink-0">
        <div className="flex items-center h-full">
          <TabButton id="terminal" label="Terminal" />
          <TabButton id="stdin" label="Input" />
        </div>
        <div className="flex items-center gap-1 pr-1">
          <button
            onClick={handleCopy}
            title="Copy output"
            className="p-1.5 rounded text-[#8a8a8a] hover:text-white hover:bg-white/10"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={onClear}
            title="Clear terminal"
            className="p-1.5 rounded text-[#8a8a8a] hover:text-white hover:bg-white/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {tab === "terminal" ? (
        <div
          ref={bodyRef}
          className="flex-1 overflow-auto p-3 text-[13px] leading-relaxed"
          style={{
            fontFamily: "'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
            scrollbarColor: "#424242 transparent",
            scrollbarWidth: "thin",
          }}
        >
          {!hasRun && !isRunning ? (
            <div className="flex flex-col items-center justify-center h-full text-[#6a6a6a] gap-2">
              <TerminalSquare className="w-8 h-8 opacity-50" />
              <p className="text-xs">Press Run to execute your code</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-[#23d18b]">
                <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                <span className="text-[#cccccc]">{runCommand}</span>
              </div>

              {stdout && (
                <pre className="whitespace-pre-wrap mt-1 text-[#d4d4d4]">{colorizeOutput(stdout)}</pre>
              )}

              {(stderr || error) && (
                <pre className="whitespace-pre-wrap mt-1 text-[#f48771]">{error ?? stderr}</pre>
              )}

              {isRunning && (
                <div className="flex items-center gap-2 mt-2 text-[#8a8a8a]">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#007acc] animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#007acc] animate-bounce [animation-delay:150ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#007acc] animate-bounce [animation-delay:300ms]" />
                  </span>
                  Running…
                </div>
              )}

              {!isRunning && hasRun && exitCode !== null && (
                <div
                  className={`mt-2 text-xs ${exitCode === 0 ? "text-[#23d18b]" : "text-[#f48771]"}`}
                >
                  [Process exited with code {exitCode}
                  {time ? ` · ${time}s` : ""}]
                </div>
              )}
            </>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col p-3 gap-2">
          <label className="text-[11px] uppercase tracking-wide text-[#8a8a8a]">
            Standard input (stdin)
          </label>
          <textarea
            value={stdin}
            onChange={(e) => onStdinChange(e.target.value)}
            placeholder="Type input that your program reads from stdin…"
            spellCheck={false}
            className="flex-1 resize-none rounded bg-[#1a1a1a] border border-[#2b2b2b] focus:border-[#007acc] outline-none p-3 text-[13px] text-[#d4d4d4]"
            style={{ fontFamily: "'Fira Code', 'JetBrains Mono', 'Consolas', monospace" }}
          />
          <p className="text-[11px] text-[#6a6a6a]">
            Provide input here before running. Each line is fed to your program in order.
          </p>
        </div>
      )}
    </div>
  );
}
