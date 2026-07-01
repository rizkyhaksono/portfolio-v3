/** Weather for the given coordinates (the visitor's, passed from the client). Falls back to
 * Malang (city id 1636722) when no coordinates are provided. The API key stays server-side. */
export async function getWeather(lat?: number, lon?: number) {
  const query = lat != null && lon != null && Number.isFinite(lat) && Number.isFinite(lon) ? `lat=${lat}&lon=${lon}` : "id=1636722"
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?${query}&appid=${process.env.OPENWEATHERMAP_API_KEY}`, {
    method: "GET",
    next: {
      revalidate: 180,
    },
  })
  if (!response.ok) throw new Error("Failed to fetch weather data");
  return response.json();
}