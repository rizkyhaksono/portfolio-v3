"use client"

import { useRef, useEffect, useState } from "react";
import { Theme, themes } from "@/commons/constants/compiler";

interface CompilerCodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language?: string;
  theme?: Theme;
  onCursorChange?: (line: number, col: number) => void;
}

export function CompilerCodeEditor({
  code,
  onChange,
  theme = "tokyo-night",
  onCursorChange,
}: Readonly<CompilerCodeEditorProps>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(1);
  const [currentLine, setCurrentLine] = useState(1);

  const currentTheme = themes[theme];

  useEffect(() => {
    setLineCount(code.split("\n").length);
  }, [code]);

  const updateCursor = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    // Read from the textarea's live value (the source of truth at event time),
    // not the `code` prop, which lags one render behind during onChange.
    const before = ta.value.slice(0, ta.selectionStart);
    const linesBefore = before.split("\n");
    const line = linesBefore.length;
    const col = linesBefore[linesBefore.length - 1].length + 1;
    setCurrentLine(line);
    onCursorChange?.(line, col);
  };

  const syncScroll = () => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    if (e.key === "Tab") {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newValue = code.substring(0, start) + "  " + code.substring(end);
      onChange(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
      return;
    }

    if (e.key === "{" || e.key === "(" || e.key === "[" || e.key === '"' || e.key === "'") {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const closingChar = { "{": "}", "(": ")", "[": "]", '"': '"', "'": "'" }[e.key];
      const newValue = code.substring(0, start) + e.key + closingChar + code.substring(end);
      onChange(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const start = textarea.selectionStart;
      const beforeCursor = code.substring(0, start);
      const afterCursor = code.substring(start);
      const currentLineText = beforeCursor.split("\n").pop() || "";
      const indent = currentLineText.match(/^(\s*)/)?.[1] ?? "";
      const extraIndent =
        currentLineText.trim().endsWith("{") ||
        currentLineText.trim().endsWith("(") ||
        currentLineText.trim().endsWith("[")
          ? "  "
          : "";
      const newValue = beforeCursor + "\n" + indent + extraIndent + afterCursor;
      onChange(newValue);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length + extraIndent.length;
      }, 0);
    }
  };

  const fontStyle: React.CSSProperties = {
    fontFamily: "'Fira Code', 'JetBrains Mono', 'Consolas', 'Monaco', monospace",
    fontFeatureSettings: "'liga' 1, 'calt' 1",
    lineHeight: "1.5rem",
    fontSize: "13px",
  };

  return (
    <div className={`relative h-full w-full overflow-hidden ${currentTheme.cardBackground}`}>
      <div className="flex h-full">
        {/* Gutter */}
        <div
          ref={gutterRef}
          className={`shrink-0 overflow-hidden py-3 text-right ${currentTheme.lineNumbers.background} ${currentTheme.lineNumbers.color} select-none`}
          style={{ ...fontStyle, width: "3.5rem" }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div
              key={i}
              className={`px-3 ${i + 1 === currentLine ? `${currentTheme.textColor} opacity-100` : "opacity-60"}`}
              style={{ height: "1.5rem" }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Editor */}
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => {
            onChange(e.target.value);
            updateCursor();
          }}
          onKeyDown={handleKeyDown}
          onKeyUp={updateCursor}
          onClick={updateCursor}
          onSelect={updateCursor}
          onScroll={syncScroll}
          className={`flex-1 resize-none border-0 bg-transparent ${currentTheme.textColor} py-3 px-4 outline-none`}
          style={{
            ...fontStyle,
            caretColor: currentTheme.cursor,
            tabSize: 2,
            scrollbarColor: `${currentTheme.scrollbar} transparent`,
            scrollbarWidth: "thin",
          }}
          placeholder="// Write your code here..."
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />
      </div>
    </div>
  );
}
