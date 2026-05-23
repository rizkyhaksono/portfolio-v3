import Typography from "@/components/ui/typography"
import { getPing } from "@/services/visitor/ping"
import { getWeather } from "@/services/visitor/weather"
import { getNowPlaying } from "@/services/visitor/spotify"
import { SpotifySidebarSection } from "@/components/layout/spotify-sidebar-widget"
import { MdWifi as IpIcon, MdLocationOn, MdDevices } from "react-icons/md"
import { BiCalendar, BiGlobe } from "react-icons/bi"
import { getBrowserInfo, getWeatherEmoji } from "@/commons/constants/sidebar"

const RightSidebarMain = async () => {
  const ping = await getPing()
  const weather = await getWeather()
  const spotify = await getNowPlaying()

  const temperature = weather?.main?.temp ? Math.round(weather.main.temp - 273.15) : null

  const feelsLike = weather?.main?.feels_like ? Math.round(weather.main.feels_like - 273.15) : null

  const weatherCondition = weather?.weather?.[0]
  const weatherEmoji = weatherCondition ? getWeatherEmoji(weatherCondition.main, weatherCondition.icon) : "🌤️"

  return (
    <div className="hidden lg:flex lg:w-64 xl:w-72 flex-col p-4 space-y-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      {/* Visitor Info */}
      {ping?.user_info && (
        <div className="bg-secondary/20 rounded-lg p-4 border border-border/30">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <Typography.P className="text-sm font-semibold text-primary/80">Visitor Info</Typography.P>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <IpIcon size={14} className="text-primary/60" />
                <Typography.P className="text-xs text-primary/70">IP Address</Typography.P>
              </div>
              <div className="bg-secondary/30 rounded px-2 py-1">
                <Typography.P className="text-xs font-mono text-primary/90">{ping.user_info.ip_address?.split(",")[0]?.trim() ?? "Unknown"}</Typography.P>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MdLocationOn size={14} className="text-primary/60" />
                <Typography.P className="text-xs text-primary/70">Browser</Typography.P>
              </div>
              <div className="bg-secondary/30 rounded px-2 py-1">
                <Typography.P className="text-xs text-primary/90 truncate">{getBrowserInfo(ping.user_info.user_agent)}</Typography.P>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MdLocationOn size={14} className="text-primary/60" />
                <Typography.P className="text-xs text-primary/70">Location</Typography.P>
              </div>
              <div className="bg-secondary/30 rounded px-2 py-1">
                <Typography.P className="text-xs text-primary/90">{weather?.name ?? "Malang"}, Indonesia</Typography.P>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Status */}
      <div className="bg-secondary/20 rounded-lg p-4 border border-border/30">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <Typography.P className="text-sm font-semibold text-primary/80">Status</Typography.P>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BiCalendar size={14} className="text-primary/60" />
            <Typography.P className="text-xs text-primary/70">Available for work</Typography.P>
          </div>
          <div className="flex items-center gap-2">
            <MdDevices size={14} className="text-primary/60" />
            <Typography.P className="text-xs text-primary/70">Building cool stuff</Typography.P>
          </div>
        </div>

        <div className="mt-3 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
          <Typography.P className="text-xs text-green-600 dark:text-green-400">🚀 Open to opportunities</Typography.P>
        </div>
      </div>

      <SpotifySidebarSection spotify={spotify} />

      {/* Weather */}
      <div className="bg-secondary/20 rounded-lg p-4 border border-border/30">
        <div className="flex items-center gap-2 mb-3">
          <BiGlobe size={16} className="text-orange-500" />
          <Typography.P className="text-sm font-semibold text-primary/80">Weather</Typography.P>
        </div>

        {weather ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{weatherEmoji}</div>
              <div>
                <Typography.P className="text-lg font-bold text-primary">{temperature !== null ? `${temperature}°C` : "N/A"}</Typography.P>
                <Typography.P className="text-xs text-primary/60">{weather.name ?? "Malang"}, ID</Typography.P>
              </div>
            </div>
            <div className="text-right">
              <Typography.P className="text-xs text-primary/70 capitalize">{weatherCondition?.description ?? "Unknown"}</Typography.P>
              <Typography.P className="text-xs text-primary/60">{feelsLike !== null ? `Feels like ${feelsLike}°` : ""}</Typography.P>
              {weather.main?.humidity && <Typography.P className="text-xs text-primary/60">Humidity {weather.main.humidity}%</Typography.P>}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-4">
            <Typography.P className="text-xs text-primary/60">Weather data unavailable</Typography.P>
          </div>
        )}
      </div>
    </div>
  )
}

export default RightSidebarMain
