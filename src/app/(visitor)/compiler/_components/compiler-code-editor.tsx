import { useRef, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, Code2, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Theme, themes } from "@/commons/constants/compiler";

interface CompilerCodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language?: string;
  theme?: Theme;
  onThemeChange?: (theme: Theme) => void;
}

export function CompilerCodeEditor({
  code,
  onChange,
  language,
  theme = 'dark',
  onThemeChange
}: Readonly<CompilerCodeEditorProps>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);
  const [lines, setLines] = useState<string[]>([]);

  const currentTheme = themes[theme];

  useEffect(() => {
    setLines(code.split('\n'));
  }, [code]);

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
    }

    // Auto-closing brackets
    if (e.key === "{" || e.key === "(" || e.key === "[" || e.key === '"' || e.key === "'") {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const closingChar = {
        "{": "}",
        "(": ")",
        "[": "]",
        '"': '"',
        "'": "'"
      }[e.key];

      const newValue = code.substring(0, start) + e.key + closingChar + code.substring(end);
      onChange(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }, 0);
    }

    // Handle Enter key for auto-indentation
    if (e.key === "Enter") {
      e.preventDefault();
      const start = textarea.selectionStart;
      const beforeCursor = code.substring(0, start);
      const afterCursor = code.substring(start);
      const currentLine = beforeCursor.split('\n').pop() || '';
      const indentMatch = currentLine.match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1] : '';

      // Add extra indent if line ends with opening bracket
      const extraIndent = currentLine.trim().endsWith('{') ||
        currentLine.trim().endsWith('(') ||
        currentLine.trim().endsWith('[') ? '  ' : '';

      const newValue = beforeCursor + '\n' + indent + extraIndent + afterCursor;
      onChange(newValue);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length + extraIndent.length;
      }, 0);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  const getLanguageColor = (lang?: string) => {
    const colors = {
      javascript: "bg-yellow-500",
      python: "bg-blue-500",
      java: "bg-red-500",
      cpp: "bg-purple-500",
      c: "bg-gray-500",
    };
    return colors[lang as keyof typeof colors] || "bg-gray-500";
  };

  return (
    <Card className={`flex flex-col h-full shadow-lg border-0 bg-gradient-to-br ${currentTheme.background}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Code2 className={`w-5 h-5 ${currentTheme.lineNumbers.color}`} />
            <CardTitle className={`text-lg ${currentTheme.textColor}`}>Code Editor</CardTitle>
            {language && (
              <Badge variant="secondary" className="text-xs">
                <div className={`w-2 h-2 rounded-full mr-1 ${getLanguageColor(language)}`} />
                {language.charAt(0).toUpperCase() + language.slice(1)}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onThemeChange && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Palette className="w-4 h-4" />
                    {currentTheme.name}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {Object.entries(themes).map(([key, themeConfig]) => (
                    <DropdownMenuItem
                      key={key}
                      onClick={() => onThemeChange(key as Theme)}
                      className="flex items-center justify-between"
                    >
                      <span>{themeConfig.name}</span>
                      {theme === key && <Check className="w-4 h-4" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyCode}
              className={`${currentTheme.lineNumbers.color} hover:${currentTheme.textColor} hover:bg-opacity-20`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <Separator className={`${currentTheme.lineNumbers.border.replace('border-', 'bg-')}`} />
      <CardContent className="flex-1 p-0 relative overflow-hidden">
        <div className="relative h-full">
          {/* Line numbers */}
          <div className={`absolute left-0 top-0 ${currentTheme.lineNumbers.background} border-r ${currentTheme.lineNumbers.border} ${currentTheme.lineNumbers.color} font-mono text-xs select-none pointer-events-none z-10`}>
            <div className="px-3 py-4 space-y-0">
              {lines.map((_, index) => (
                <div key={index} className="h-6 flex items-center justify-end min-w-[2.5rem]">
                  {index + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Code textarea */}
          <Textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`h-full resize-none border-0 bg-transparent ${currentTheme.textColor} font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none pl-16 pr-4 py-4 leading-6 mx-2`}
            style={{
              fontFamily: "'Fira Code', 'JetBrains Mono', 'Consolas', 'Monaco', monospace",
              fontFeatureSettings: "'liga' 1, 'calt' 1",
              tabSize: 2,
              caretColor: currentTheme.cursor,
              scrollbarColor: currentTheme.scrollbar,
            }}
            placeholder="Write your code here..."
            spellCheck={false}
          />
        </div>
      </CardContent>
    </Card>
  );
}