export async function getWeather() {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?id=1636722&appid=${process.env.OPENWEATHERMAP_API_KEY}`, {
    method: "GET",
    next: {
      revalidate: 180,
    },
  })
  if (!response.ok) throw new Error("Failed to fetch weather data");
  return response.json();
}