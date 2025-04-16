"use client"

import { getWeatherIcon } from "@/lib/weather-icons"
import type { WeatherType } from "@/types/weather"

interface WeatherIconProps {
  weather?: WeatherType["weather"][0]
  className?: string
}

export function WeatherIcon({ weather, className = "" }: WeatherIconProps) {
  if (!weather) return null

  const Icon = getWeatherIcon(weather.main)
  return <Icon className={className} />
} 