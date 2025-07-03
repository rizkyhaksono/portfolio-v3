export interface PistonExecuteRequest {
  language: string;
  version: string;
  files: Array<{
    content: string;
    name?: string;
  }>;
}

export interface PistonExecuteResponse {
  language: string;
  version: string;
  run: {
    stdout: string;
    stderr: string;
    code: number;
    signal: string | null;
    output: string;
  };
}

export interface Language {
  value: string;
  label: string;
  version: string;
  defaultCode: string;
}

export interface CompilerState {
  code: string;
  language: string;
  output: string;
  isRunning: boolean;
  error: string | null;
}