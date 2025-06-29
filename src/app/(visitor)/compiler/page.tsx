"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { useState, useRef } from "react";
import { Play, Download, Copy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface CompilerState {
  code: string;
  language: string;
  output: string;
  isRunning: boolean;
  theme: "light" | "dark";
}

const LANGUAGES = [
  { value: "javascript", label: "JavaScript", defaultCode: 'console.log("Hello, World!");' },
  { value: "python", label: "Python", defaultCode: 'print("Hello, World!")' },
  { value: "java", label: "Java", defaultCode: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}' },
  { value: "cpp", label: "C++", defaultCode: '#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}' },
  { value: "c", label: "C", defaultCode: '#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}' },
  { value: "html", label: "HTML", defaultCode: '<!DOCTYPE html>\n<html>\n<head>\n    <title>Hello World</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n</body>\n</html>' },
];

export default function CompilerPage() {
  const [state, setState] = useState<CompilerState>({
    code: LANGUAGES[0].defaultCode,
    language: LANGUAGES[0].value,
    output: "",
    isRunning: false,
    theme: "dark",
  });

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleLanguageChange = (language: string) => {
    const selectedLang = LANGUAGES.find(lang => lang.value === language);
    setState(prev => ({
      ...prev,
      language,
      code: selectedLang?.defaultCode ?? "",
      output: "",
    }));
  };

  const handleRunCode = async () => {
    setState(prev => ({ ...prev, isRunning: true, output: "" }));

    // Simulate code execution
    setTimeout(() => {
      let simulatedOutput = "";

      switch (state.language) {
        case "javascript":
          simulatedOutput = "Hello, World!\n\n[Finished in 0.2s]";
          break;
        case "python":
          simulatedOutput = "Hello, World!\n\n[Finished in 0.3s]";
          break;
        case "java":
          simulatedOutput = "Hello, World!\n\n[Finished in 1.2s]";
          break;
        case "cpp":
          simulatedOutput = "Hello, World!\n\n[Finished in 0.8s]";
          break;
        case "c":
          simulatedOutput = "Hello, World!\n\n[Finished in 0.7s]";
          break;
        case "html":
          simulatedOutput = "[HTML Preview would be shown here]\n\n[Rendered successfully]";
          break;
        default:
          simulatedOutput = "Language not supported yet.\n\n[Error]";
      }

      setState(prev => ({
        ...prev,
        output: simulatedOutput,
        isRunning: false,
      }));
    }, 1500);
  };

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(state.code);
  };

  const handleDownloadCode = () => {
    const extensions: { [key: string]: string } = {
      javascript: "js",
      python: "py",
      java: "java",
      cpp: "cpp",
      c: "c",
      html: "html",
    };

    const extension = extensions[state.language] || "txt";
    const blob = new Blob([state.code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `code.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    const selectedLang = LANGUAGES.find(lang => lang.value === state.language);
    setState(prev => ({
      ...prev,
      code: selectedLang?.defaultCode ?? "",
      output: "",
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newValue = state.code.substring(0, start) + "  " + state.code.substring(end);
        setState(prev => ({ ...prev, code: newValue }));

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        }, 0);
      }
    }
  };

  return (
    <BlurFade delay={0.25} inView>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Online Compiler</h1>
        <p className="text-muted-foreground">
          Write, compile, and run code in various programming languages online.
        </p>
      </div>

      {/* Disclaimer */}
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20 dark:border-yellow-800 mb-4">
        <CardContent className="p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            <strong>Disclaimer:</strong> {`Under development....`}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Select value={state.language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                onClick={handleRunCode}
                disabled={state.isRunning}
                className="bg-green-600 hover:bg-green-700"
              >
                <Play className="w-4 h-4 mr-2" />
                {state.isRunning ? "Running..." : "Run"}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyCode}
                title="Copy Code"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleDownloadCode}
                title="Download Code"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleReset}
                title="Reset Code"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[80vh] mt-4">
        {/* Code Editor */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg">Code Editor</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="flex-1 p-0">
            <div className="relative h-full">
              <Textarea
                ref={textareaRef}
                value={state.code}
                onChange={(e) => setState(prev => ({ ...prev, code: e.target.value }))}
                onKeyDown={handleKeyDown}
                className="h-full resize-none border-0 bg-slate-900 text-slate-100 font-mono text-sm focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
                style={{
                  fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
                  lineHeight: "1.5",
                  tabSize: 2,
                  paddingLeft: "3rem",
                }}
                placeholder="Write your code here..."
                spellCheck={false}
              />

              {/* Line numbers */}
              <div className="absolute left-0 top-0 p-3 text-slate-500 font-mono text-sm pointer-events-none select-none">
                {state.code.split('\n').map((_, index) => (
                  <div key={index} className="leading-6">
                    {index + 1}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Output</CardTitle>
              {state.isRunning && (
                <Badge variant="secondary" className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Running...
                </Badge>
              )}
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="flex-1 p-0">
            <div className="h-full overflow-auto">
              <pre className="p-4 font-mono text-sm bg-slate-900 text-slate-100 h-full whitespace-pre-wrap">
                {state.output || "Click 'Run' to execute your code..."}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </BlurFade>
  );
}