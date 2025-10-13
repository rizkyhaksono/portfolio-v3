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
  const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.error('API_URL is not defined in environment variables');
    return null;
  }

  try {
    const response = await fetch(`${apiUrl}/ping`, {
      method: "GET",
      next: {
        revalidate: 0,
      },
    });
    if (response.status !== 200) return null;
    return response.json();
  } catch (error) {
    console.error('Error fetching ping:', error);
    return null;
  }
}