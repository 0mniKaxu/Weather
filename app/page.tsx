"use client"

import { useEffect, useState } from "react"
import { WeatherDashboard } from "@/components/weather-dashboard"
import { useWeatherContext } from "@/contexts/WeatherContext"

export default function Home() {
  const { fetchWeatherByCity } = useWeatherContext()
  const [city, setCity] = useState("")

  useEffect(() => {
    if (city) {
      fetchWeatherByCity(city)
    }
  }, [city, fetchWeatherByCity])

  return <WeatherDashboard />
}
