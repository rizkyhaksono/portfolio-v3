import { ExecuteCodeRequest, ExecuteCodeResult } from "@/commons/types/compiler";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function postExecuteCode(request: ExecuteCodeRequest): Promise<ExecuteCodeResult> {
  const response = await fetch(`${API_URL}/v3/tools/compiler/execute`, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  const json = await response.json().catch(() => null);

  if (!response.ok || !json || json.status >= 400 || !json.data) {
    throw new Error(json?.message || `Error: ${response.status} - ${response.statusText}`);
  }

  return json.data as ExecuteCodeResult;
}
