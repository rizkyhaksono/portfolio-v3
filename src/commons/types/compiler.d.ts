export interface ExecuteCodeRequest {
  language: string;
  version?: string;
  code: string;
  stdin?: string;
}

export interface ExecuteCodeResult {
  stdout: string;
  stderr: string;
  output: string;
  exitCode: number;
  time: string | null;
  language: string;
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
  stdin: string;
  output: string;
  stderr: string;
  exitCode: number | null;
  time: string | null;
  isRunning: boolean;
  error: string | null;
}
