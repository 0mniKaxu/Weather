import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Sun,
  Wind,
  type LucideIcon,
} from "lucide-react"

export function getWeatherIcon(condition: string): LucideIcon {
  const conditionLower = condition.toLowerCase()

  switch (conditionLower) {
    case "clear":
      return Sun
    case "clouds":
      return Cloud
    case "rain":
      return CloudRain
    case "drizzle":
      return CloudDrizzle
    case "thunderstorm":
      return CloudLightning
    case "snow":
      return CloudSnow
    case "mist":
    case "fog":
    case "haze":
      return CloudFog
    case "dust":
    case "sand":
    case "ash":
    case "squall":
    case "tornado":
      return Wind
    default:
      return Cloud
  }
}
