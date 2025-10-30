export interface PingResponse {
  status: number;
  message: string;
  timestamp: string;
  user_info: {
    ip_address: string;
    user_agent: string;
    host: string;
    referer?: string;
    language: string;
    method: string;
    url: string;
  };
}

export async function getPing() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ping`, {
    method: "GET",
    next: { revalidate: 0 },
  });
  if (response.status !== 200) return null;
  return response.json();
}