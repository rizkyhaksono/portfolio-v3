export async function getVisitor() {
  const response = await fetch("https://api.ipify.org?format=json", {
    method: "GET",
    next: {
      revalidate: 0,
    },
  });
  if (response.status !== 200) return {};
  return response.json();
}