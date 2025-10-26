import { Play, Download, Copy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Language } from "@/commons/types/compiler";

interface CompilerToolbarProps {
  language: string;
  languages: Language[];
  isRunning: boolean;
  onLanguageChange: (language: string) => void;
  onRunCode: () => void;
  onCopyCode: () => void;
  onDownloadCode: () => void;
  onReset: () => void;
}

export function CompilerToolbar({
  language,
  languages,
  isRunning,
  onLanguageChange,
  onRunCode,
  onCopyCode,
  onDownloadCode,
  onReset,
}: CompilerToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <Select value={language} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={onRunCode}
          disabled={isRunning}
          className="bg-green-600 hover:bg-green-700"
        >
          <Play className="w-4 h-4 mr-2" />
          {isRunning ? "Running..." : "Run"}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onCopyCode}
          title="Copy Code"
        >
          <Copy className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onDownloadCode}
          title="Download Code"
        >
          <Download className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          title="Reset Code"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}