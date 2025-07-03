import { PistonExecuteRequest, PistonExecuteResponse } from "@/commons/types/compiler";

const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

export async function postExecuteCode(request: PistonExecuteRequest): Promise<PistonExecuteResponse> {
  const response = await fetch(PISTON_API_URL, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "DNT": "1" // Do Not Track header
    },
    body: JSON.stringify(request)
  })

  if (!response.ok) {
    throw new Error(`Error: ${response.status} - ${response.statusText}`);
  }

  return await response.json();
}