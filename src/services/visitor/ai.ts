export async function getAIData(prompt: string): Promise<string> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: prompt,
    }),
  });
  return await response.text();
};