export async function getWeather() {
  const response = await fetch("https://api.openweathermap.org/data/2.5/weather?id=1636722&appid=5796abbde9106b7da4febfae8c44c232",
    {
      method: "GET",
      next: {
        revalidate: 180,
      },
    }
  )
  if (!response.ok) throw new Error("Failed to fetch weather data");
  return response.json();
}

export async function getWeatherOneCall() {
  const response = await fetch("https://api.openweathermap.org/data/2.5/onecall?lat=-7.9797&lon=112.6304&units=metric&appid=5796abbde9106b7da4febfae8c44c232",
    {
      method: "GET",
      next: {
        revalidate: 0,
      },
    }
  )
  if (!response.ok) throw new Error("Failed to fetch weather data");
  return response.json();
}