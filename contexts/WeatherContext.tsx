"use client"

import { createContext, useContext } from "react"
import { useWeather } from "@/hooks/use-weather"

const WeatherContext = createContext<ReturnType<typeof useWeather> | null>(null)

export function WeatherProvider({ children }: { children: React.ReactNode }) {
  const weather = useWeather()

  return (
    <WeatherContext.Provider value={weather}>
      {children}
    </WeatherContext.Provider>
  )
}

export function useWeatherContext() {
  const context = useContext(WeatherContext)
  if (!context) {
    throw new Error("useWeatherContext must be used within a WeatherProvider")
  }
  return context
} 