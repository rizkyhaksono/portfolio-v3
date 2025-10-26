import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Copy, Check, Terminal, AlertCircle, CheckCircle, Download, TerminalSquare } from "lucide-react";
import { Theme, themes } from "@/commons/constants/compiler";

interface CompilerOutputPanelProps {
  output: string;
  error: string | null;
  isRunning: boolean;
  theme?: Theme;
}

export function CompilerOutputPanel({
  output,
  error,
  isRunning,
  theme = 'dark'
}: Readonly<CompilerOutputPanelProps>) {
  const [copied, setCopied] = useState(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const outputRef = useRef<HTMLPreElement>(null);

  // Use useRef to track execution timing without causing re-renders
  const executionStartTime = useRef<number | null>(null);
  const wasRunning = useRef(false);

  const currentTheme = themes[theme];

  useEffect(() => {
    // Handle execution timing
    if (isRunning && !wasRunning.current) {
      // Just started running
      executionStartTime.current = Date.now();
      setExecutionTime(null);
      wasRunning.current = true;
    } else if (!isRunning && wasRunning.current) {
      // Just finished running
      if (executionStartTime.current) {
        const endTime = Date.now();
        setExecutionTime(endTime - executionStartTime.current);
      }
      wasRunning.current = false;
    }
  }, [isRunning]);

  useEffect(() => {
    // Auto-scroll to bottom when new output is added
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, error]);

  const handleCopyOutput = async () => {
    const content = error || output || "";
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy output:", error);
    }
  };

  const handleDownloadOutput = () => {
    const content = error || output || "";
    if (!content) return;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `output_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getStatusInfo = () => {
    // Define theme-aware colors
    const getThemeColors = () => {
      const isLightTheme = theme === 'light' || theme === 'github' || theme === 'solarized';

      return {
        running: {
          dot: isLightTheme ? 'bg-blue-600' : 'bg-blue-500',
          text: isLightTheme ? 'text-blue-700' : 'text-blue-400'
        },
        error: {
          icon: isLightTheme ? 'text-red-600' : 'text-red-400',
          text: isLightTheme ? 'text-red-700' : 'text-red-400'
        },
        success: {
          icon: isLightTheme ? 'text-green-600' : 'text-green-400',
          text: isLightTheme ? 'text-green-700' : 'text-green-400'
        },
        ready: {
          icon: isLightTheme ? 'text-gray-600' : 'text-slate-400',
          text: isLightTheme ? 'text-gray-700' : 'text-slate-400'
        }
      };
    };

    const colors = getThemeColors();

    if (isRunning) {
      return {
        icon: <div className={`w-2 h-2 ${colors.running.dot} rounded-full animate-pulse`} />,
        text: "Running...",
        variant: "secondary" as const,
        color: colors.running.text
      };
    }
    if (error) {
      return {
        icon: <AlertCircle className={`w-4 h-4 ${colors.error.icon}`} />,
        text: "Error",
        variant: "destructive" as const,
        color: colors.error.text
      };
    }
    if (output) {
      return {
        icon: <CheckCircle className={`w-4 h-4 ${colors.success.icon}`} />,
        text: "Success",
        variant: "secondary" as const,
        color: colors.success.text
      };
    }
    return {
      icon: <Terminal className={`w-4 h-4 ${colors.ready.icon}`} />,
      text: "Ready",
      variant: "outline" as const,
      color: colors.ready.text
    };
  };

  const getDisplayContent = () => {
    if (error) {
      return formatError(error);
    }
    if (output) {
      return output;
    }
    return "Click 'Run' to execute your code and see the output here...";
  };

  const formatError = (errorMessage: string) => {
    // Basic error formatting
    return errorMessage
      .replace(/Error:/g, '❌ Error:')
      .replace(/Warning:/g, '⚠️ Warning:')
      .replace(/at line (\d+)/g, '→ at line $1');
  };

  const getOutputClassName = () => {
    const isLightTheme = theme === 'light' || theme === 'github' || theme === 'solarized';

    if (error) {
      return isLightTheme
        ? 'text-red-800 bg-red-50 border-l-4 border-red-500'
        : 'text-red-300 bg-red-950/20 border-l-4 border-red-500';
    }
    if (output) {
      return isLightTheme
        ? 'text-green-800 bg-green-50 border-l-4 border-green-500'
        : 'text-green-300 bg-green-950/20 border-l-4 border-green-500';
    }

    // Default text color for empty state
    return isLightTheme
      ? 'text-gray-700'
      : currentTheme.textColor.replace('text-slate-100', 'text-slate-400').replace('text-purple-100', 'text-purple-400');
  };

  const statusInfo = getStatusInfo();

  return (
    <Card className={`flex flex-col h-full shadow-lg border-0 bg-gradient-to-br ${currentTheme.background}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TerminalSquare className={`w-5 h-5 ${currentTheme.lineNumbers.color}`} />
            <CardTitle className={`text-lg ${currentTheme.textColor}`}>Output</CardTitle>
            <Badge variant={statusInfo.variant} className="flex items-center gap-2 text-xs">
              {statusInfo.icon}
              {statusInfo.text}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            {executionTime && (
              <Badge
                variant="outline"
                className={`text-xs ${theme === 'light' || theme === 'github' || theme === 'solarized'
                  ? 'text-gray-700 border-gray-300'
                  : currentTheme.lineNumbers.color
                  }`}
              >
                {executionTime}ms
              </Badge>
            )}
            {(output || error) && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDownloadOutput}
                  className={`${currentTheme.lineNumbers.color} hover:${currentTheme.textColor} hover:bg-opacity-20`}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyOutput}
                  className={`${currentTheme.lineNumbers.color} hover:${currentTheme.textColor} hover:bg-opacity-20`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <Separator className={`${currentTheme.lineNumbers.border.replace('border-', 'bg-')}`} />
      <CardContent className="flex-1 p-0 relative overflow-hidden">
        <div className="relative h-full">
          {/* Output content */}
          <pre
            ref={outputRef}
            className={`h-full overflow-auto p-4 font-mono text-sm whitespace-pre-wrap ${currentTheme.cardBackground} ${getOutputClassName()}`}
            style={{
              fontFamily: "'Fira Code', 'JetBrains Mono', 'Consolas', 'Monaco', monospace",
              fontFeatureSettings: "'liga' 1, 'calt' 1",
              lineHeight: "1.5",
              scrollbarWidth: "thin",
              scrollbarColor: `${currentTheme.scrollbar} transparent`
            }}
          >
            {getDisplayContent()}
          </pre>

          {/* Running indicator overlay */}
          {isRunning && (
            <div className={`absolute inset-0 ${currentTheme.cardBackground}/80 backdrop-blur-sm flex items-center justify-center`}>
              <div className={`flex items-center gap-3 ${currentTheme.textColor}`}>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm">Executing code...</span>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!output && !error && !isRunning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`text-center ${currentTheme.lineNumbers.color}`}>
                <Terminal className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">No output yet</p>
                <p className="text-xs mt-1">Run your code to see results here</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}