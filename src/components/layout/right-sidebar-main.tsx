import Typography from "@/components/ui/typography";
import { getVisitor } from "@/services/visitor/visitor";
import { getWeather } from "@/services/visitor/weather";
import { MdWifi as IpIcon, MdLocationOn, MdDevices, MdTrendingUp } from "react-icons/md";
import { BiCalendar, BiGlobe } from "react-icons/bi";
import RightSidebarClient from "./right-sidebar-client";

const RightSidebarMain = async () => {
  const visitor = await getVisitor();
  const weather = await getWeather();

  const getWeatherEmoji = (weatherMain: string, icon: string) => {
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

  // Extract weather data
  const temperature = weather?.main?.temp
    ? Math.round(weather.main.temp - 273.15) // Convert from Kelvin to Celsius
    : null;

  const feelsLike = weather?.main?.feels_like
    ? Math.round(weather.main.feels_like - 273.15)
    : null;

  const weatherCondition = weather?.weather?.[0];
  const weatherEmoji = weatherCondition
    ? getWeatherEmoji(weatherCondition.main, weatherCondition.icon)
    : '🌤️';

  const quickStats = [
    { label: "Projects", value: "15+" },
    { label: "Experience", value: "2+ Years" },
    { label: "Technologies", value: "20+" },
    { label: "Coffee Cups", value: "∞" }
  ];

  // TODO: Implement using Spotify API
  const currentlyListening = {
    song: "Bohemian Rhapsody",
    artist: "Queen",
    isPlaying: true
  };

  return (
    <div className="hidden lg:flex lg:w-64 xl:w-72 flex-col p-4 space-y-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      {/* Visitor Info */}
      {/* <div className="bg-secondary/20 rounded-lg p-4 border border-border/30">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <Typography.P className="text-sm font-semibold text-primary/80">
            Visitor Info
          </Typography.P>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <IpIcon size={14} className="text-primary/60" />
            <Typography.P className="text-xs text-primary/70">
              IP Address
            </Typography.P>
          </div>
          <div className="bg-secondary/30 rounded px-2 py-1">
            <Typography.P className="text-xs font-mono text-primary/90">
              {visitor?.ip ?? "Unknown"}
            </Typography.P>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <MdLocationOn size={14} className="text-primary/60" />
            <Typography.P className="text-xs text-primary/70">
              {weather?.name ?? "Malang"}, Indonesia
            </Typography.P>
          </div>

          <RightSidebarClient />
        </div>
      </div> */}

      {/* Status */}
      <div className="bg-secondary/20 rounded-lg p-4 border border-border/30">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <Typography.P className="text-sm font-semibold text-primary/80">
            Status
          </Typography.P>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BiCalendar size={14} className="text-primary/60" />
            <Typography.P className="text-xs text-primary/70">
              Available for work
            </Typography.P>
          </div>
          <div className="flex items-center gap-2">
            <MdDevices size={14} className="text-primary/60" />
            <Typography.P className="text-xs text-primary/70">
              Building cool stuff
            </Typography.P>
          </div>
        </div>

        <div className="mt-3 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
          <Typography.P className="text-xs text-green-600 dark:text-green-400">
            🚀 Open to opportunities
          </Typography.P>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-secondary/20 rounded-lg p-4 border border-border/30">
        <div className="flex items-center gap-2 mb-3">
          <MdTrendingUp size={16} className="text-blue-500" />
          <Typography.P className="text-sm font-semibold text-primary/80">
            Quick Stats
          </Typography.P>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-secondary/30 rounded-lg p-2 text-center">
              <Typography.P className="text-sm font-bold text-primary">
                {stat.value}
              </Typography.P>
              <Typography.P className="text-xs text-primary/60">
                {stat.label}
              </Typography.P>
            </div>
          ))}
        </div>
      </div>

      {/* Currently Listening */}
      <div className="bg-secondary/20 rounded-lg p-4 border border-border/30">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <Typography.P className="text-sm font-semibold text-primary/80">
            Now Playing
          </Typography.P>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs">♪</span>
          </div>
          <div className="flex-1 min-w-0">
            <Typography.P className="text-xs font-medium text-primary/90 truncate">
              {currentlyListening.song}
            </Typography.P>
            <Typography.P className="text-xs text-primary/60 truncate">
              {currentlyListening.artist}
            </Typography.P>
          </div>
        </div>

        {currentlyListening.isPlaying && (
          <div className="mt-2 flex items-center gap-1">
            <div className="w-1 h-3 bg-green-500 rounded animate-pulse"></div>
            <div className="w-1 h-2 bg-green-500 rounded animate-pulse delay-75"></div>
            <div className="w-1 h-4 bg-green-500 rounded animate-pulse delay-150"></div>
            <div className="w-1 h-2 bg-green-500 rounded animate-pulse delay-200"></div>
          </div>
        )}
      </div>

      {/* Weather */}
      <div className="bg-secondary/20 rounded-lg p-4 border border-border/30">
        <div className="flex items-center gap-2 mb-3">
          <BiGlobe size={16} className="text-orange-500" />
          <Typography.P className="text-sm font-semibold text-primary/80">
            Weather
          </Typography.P>
        </div>

        {weather ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{weatherEmoji}</div>
              <div>
                <Typography.P className="text-lg font-bold text-primary">
                  {temperature !== null ? `${temperature}°C` : "N/A"}
                </Typography.P>
                <Typography.P className="text-xs text-primary/60">
                  {weather.name ?? "Malang"}, ID
                </Typography.P>
              </div>
            </div>
            <div className="text-right">
              <Typography.P className="text-xs text-primary/70 capitalize">
                {weatherCondition?.description ?? "Unknown"}
              </Typography.P>
              <Typography.P className="text-xs text-primary/60">
                {feelsLike !== null ? `Feels like ${feelsLike}°` : ""}
              </Typography.P>
              {weather.main?.humidity && (
                <Typography.P className="text-xs text-primary/60">
                  Humidity {weather.main.humidity}%
                </Typography.P>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-4">
            <Typography.P className="text-xs text-primary/60">
              Weather data unavailable
            </Typography.P>
          </div>
        )}
      </div>
    </div>
  );
};

export default RightSidebarMain;