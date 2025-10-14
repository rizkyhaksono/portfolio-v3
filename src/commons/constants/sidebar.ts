export const getBrowserInfo = (userAgent: string) => {
  if (userAgent.includes('Chrome')) return '🌐 Chrome';
  if (userAgent.includes('Firefox')) return '🦊 Firefox';
  if (userAgent.includes('Safari')) return '🧭 Safari';
  return '🌐 Browser';
};

export const quickStats = [
  { label: "Projects", value: "15+" },
  { label: "Experience", value: "2+ Years" },
  { label: "Technologies", value: "20+" },
  { label: "Coffee Cups", value: "∞" }
];

export const getWeatherEmoji = (weatherMain: string, icon: string) => {
  const isNight = icon.includes('n');
  switch (weatherMain.toLowerCase()) {
    case 'clear':
      return isNight ? '🌙' : '☀️';
    case 'clouds':
      return isNight ? '☁️' : '⛅';
    case 'rain':
      return '🌧️';
    case 'drizzle':
      return '🌦️';
    case 'thunderstorm':
      return '⛈️';
    case 'snow':
      return '❄️';
    case 'mist':
    case 'fog':
      return '🌫️';
    default:
      return '🌤️';
  }
};