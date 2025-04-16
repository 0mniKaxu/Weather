"use client"

import { useState, useCallback, useEffect } from "react"
import type { WeatherType, ForecastType } from "@/types/weather"

export function useWeather() {
  const [weather, setWeather] = useState<WeatherType | null>(null)
  const [forecast, setForecast] = useState<ForecastType[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null)

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          })
        },
        (error) => {
          console.error("Error getting location:", error.message)
          setError("Unable to get your location. Please enable location services or search for a city.")
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      )
    } else {
      setError("Geolocation is not supported by your browser")
    }
  }, [])

  // Fetch weather when location changes
  useEffect(() => {
    if (location) {
      fetchWeatherByCoords(location.lat, location.lon)
    }
  }, [location])

  const fetchWeatherByCoords = useCallback(async (lat: number, lon: number) => {
    setLoading(true)
    setError(null)

    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
      if (!apiKey) {
        throw new Error("OpenWeather API key is not configured")
      }

      // Current weather by coordinates
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`,
      )

      if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather data")
      }

      const weatherData = await weatherResponse.json()
      setWeather(weatherData)

      // 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`,
      )

      if (!forecastResponse.ok) {
        throw new Error("Failed to fetch forecast data")
      }

      const forecastData = await forecastResponse.json()
      
      // Transform 3-hour forecast into daily forecast
      const dailyForecast = forecastData.list.reduce((acc: any[], item: any) => {
        const date = new Date(item.dt * 1000).toDateString()
        const existingDay = acc.find(d => new Date(d.dt * 1000).toDateString() === date)
        
        if (!existingDay) {
          acc.push({
            dt: item.dt,
            temp: {
              day: item.main.temp,
              min: item.main.temp_min,
              max: item.main.temp_max,
              night: item.main.temp,
              eve: item.main.temp,
              morn: item.main.temp
            },
            weather: item.weather,
            clouds: item.clouds.all,
            pressure: item.main.pressure,
            humidity: item.main.humidity,
            wind_speed: item.wind.speed,
            wind_deg: item.wind.deg,
            pop: 0,
            uvi: 0
          })
        } else {
          existingDay.temp.min = Math.min(existingDay.temp.min, item.main.temp_min)
          existingDay.temp.max = Math.max(existingDay.temp.max, item.main.temp_max)
        }
        return acc
      }, []).slice(0, 7)
      
      setForecast(dailyForecast)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchWeatherByCity = useCallback(async (city: string) => {
    setLoading(true)
    setError(null)

    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY
      if (!apiKey) {
        throw new Error("OpenWeather API key is not configured")
      }

      // Current weather by city name
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`,
      )

      if (!weatherResponse.ok) {
        throw new Error(`City "${city}" not found`)
      }

      const weatherData = await weatherResponse.json()
      setWeather(weatherData)
      setLocation({ lat: weatherData.coord.lat, lon: weatherData.coord.lon })

      // 5-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&units=metric&appid=${apiKey}`,
      )

      if (!forecastResponse.ok) {
        throw new Error("Failed to fetch forecast data")
      }

      const forecastData = await forecastResponse.json()
      
      // Transform 3-hour forecast into daily forecast
      const dailyForecast = forecastData.list.reduce((acc: any[], item: any) => {
        const date = new Date(item.dt * 1000).toDateString()
        const existingDay = acc.find(d => new Date(d.dt * 1000).toDateString() === date)
        
        if (!existingDay) {
          acc.push({
            dt: item.dt,
            temp: {
              day: item.main.temp,
              min: item.main.temp_min,
              max: item.main.temp_max,
              night: item.main.temp,
              eve: item.main.temp,
              morn: item.main.temp
            },
            weather: item.weather,
            clouds: item.clouds.all,
            pressure: item.main.pressure,
            humidity: item.main.humidity,
            wind_speed: item.wind.speed,
            wind_deg: item.wind.deg,
            pop: 0,
            uvi: 0
          })
        } else {
          existingDay.temp.min = Math.min(existingDay.temp.min, item.main.temp_min)
          existingDay.temp.max = Math.max(existingDay.temp.max, item.main.temp_max)
        }
        return acc
      }, []).slice(0, 7)
      
      setForecast(dailyForecast)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  return { weather, forecast, loading, error, fetchWeatherByCity }
}
