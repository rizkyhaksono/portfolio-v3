"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CompilerOutputPanel } from "./_components/compiler-output-panel";
import { CompilerCodeEditor } from "./_components/compiler-code-editor";
import { CompilerToolbar } from "./_components/compiler-toolbar";
import { CompilerState } from "@/commons/types/compiler";
import { postExecuteCode } from "@/services/visitor/compiler";
import { LANGUAGES } from "@/commons/constants/compiler";

type Theme = 'dark' | 'light' | 'dracula' | 'monokai' | 'github' | 'solarized';

export default function CompilerPage() {
  const [theme, setTheme] = useState<Theme>('dark');

  const [state, setState] = useState<CompilerState>({
    code: LANGUAGES[0].defaultCode,
    language: LANGUAGES[0].value,
    output: "",
    isRunning: false,
    error: null,
  });

  const handleLanguageChange = (language: string) => {
    const selectedLang = LANGUAGES.find(lang => lang.value === language);
    setState(prev => ({
      ...prev,
      language,
      code: selectedLang?.defaultCode ?? "",
      output: "",
      error: null,
    }));
  };

  const handleRunCode = async () => {
    if (!state.code.trim()) {
      setState(prev => ({ ...prev, error: "Please enter some code to execute." }));
      return;
    }

    setState(prev => ({ ...prev, isRunning: true, output: "", error: null }));

    try {
      const selectedLang = LANGUAGES.find(lang => lang.value === state.language);
      if (!selectedLang) {
        throw new Error("Language not found");
      }

      const request = {
        language: selectedLang.value,
        version: selectedLang.version,
        files: [
          {
            content: state.code,
          },
        ],
      };

      const response = await postExecuteCode(request);

      let output = "";
      if (response.run.stdout) {
        output += response.run.stdout;
      }
      if (response.run.stderr) {
        output += response.run.stderr;
      }
      if (!output && response.run.output) {
        output = response.run.output;
      }

      setState(prev => ({
        ...prev,
        output: output || "Program executed successfully with no output.",
        isRunning: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        isRunning: false,
      }));
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(state.code);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  const handleDownloadCode = () => {
    const extensions: { [key: string]: string } = {
      javascript: "js",
      python: "py",
      java: "java",
      cpp: "cpp",
      c: "c",
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
      error: null,
    }));
  };

  const handleCodeChange = (code: string) => {
    setState(prev => ({ ...prev, code }));
  };

  return (
    <BlurFade delay={0.25} inView>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Online Compiler</h1>
        <p className="text-muted-foreground">
          Write, compile, and run code in various programming languages online.
        </p>
      </div>

      <Card>
        <CardContent className="p-4">
          <CompilerToolbar
            language={state.language}
            languages={LANGUAGES}
            isRunning={state.isRunning}
            onLanguageChange={handleLanguageChange}
            onRunCode={handleRunCode}
            onCopyCode={handleCopyCode}
            onDownloadCode={handleDownloadCode}
            onReset={handleReset}
          />
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[80vh] mt-4">
        <CompilerCodeEditor
          code={state.code}
          onChange={handleCodeChange}
          language={state.language}
          theme={theme}
          onThemeChange={setTheme}
        />
        <CompilerOutputPanel
          output={state.output}
          error={state.error}
          isRunning={state.isRunning}
          theme={theme}
        />
      </div>
    </BlurFade>
  );
}