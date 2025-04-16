"use client"

import { useState, useEffect, useRef } from "react"
import { useWeatherContext } from "@/contexts/WeatherContext"
import { WeatherIcon } from "@/components/weather-icon"
import { WeatherForecast } from "@/components/weather-forecast"
import { WeatherDetails } from "@/components/weather-details"
import { WeatherBackground } from "@/components/weather-background"
import { WeatherHeader } from "@/components/weather-header"
import { Wind, Sunrise, Sunset, MapPin } from "lucide-react"
import { motion } from "framer-motion"

export function WeatherDashboard() {
  const [showSearch, setShowSearch] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [suggestionIndex, setSuggestionIndex] = useState(-1)
  const [suggestionsLoading, setSuggestionsLoading] = useState(false)
  const { weather, forecast, loading, error, fetchWeatherByCity } = useWeatherContext()
  const inputRef = useRef<HTMLInputElement>(null)
  const [cityList, setCityList] = useState<any[]>([])
  const [cityListLoaded, setCityListLoaded] = useState(false)
  const [geoLoading, setGeoLoading] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [locationAttempted, setLocationAttempted] = useState(false)

  // Auto-detect location on mount
  useEffect(() => {
    if (!locationAttempted) {
      getUserLocation()
      setLocationAttempted(true)
    }
  }, [locationAttempted])

  // Load city list on first input
  useEffect(() => {
    if (!cityListLoaded && searchInput.trim()) {
      fetch('/cities.json')
        .then(res => res.json())
        .then(data => {
          setCityList(data)
          setCityListLoaded(true)
        })
    }
  }, [searchInput, cityListLoaded])

  // Filter city suggestions locally
  useEffect(() => {
    if (!searchInput.trim() || !cityListLoaded) {
      setSuggestions([])
      setSuggestionIndex(-1)
      return
    }
    const input = searchInput.trim().toLowerCase()
    const matches = cityList
      .filter((city: any) => city.name.toLowerCase().startsWith(input))
      .slice(0, 8)
      .map((city: any) => `${city.name}, ${city.country}`)
    setSuggestions(matches)
    setSuggestionIndex(-1)
  }, [searchInput, cityList, cityListLoaded])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestions.length) return
    if (e.key === "ArrowDown") {
      setSuggestionIndex((prev) => (prev + 1) % suggestions.length)
    } else if (e.key === "ArrowUp") {
      setSuggestionIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length)
    } else if (e.key === "Enter") {
      if (suggestionIndex >= 0) {
        selectSuggestion(suggestions[suggestionIndex])
        e.preventDefault()
      }
    }
  }

  const selectSuggestion = (city: string) => {
    setSearchInput(city)
    setSuggestions([])
    setSuggestionIndex(-1)
    fetchWeatherByCity(city)
    setShowSearch(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      fetchWeatherByCity(searchInput.trim())
      setShowSearch(false)
      setSearchInput("")
      setSuggestions([])
      setSuggestionIndex(-1)
    }
  }

  const getUserLocation = async () => {
    setGeoLoading(true)
    setGeoError(null)

    try {
      // Primary: IP-based location using Mozilla Location Service
      try {
        const response = await fetch('https://location.services.mozilla.com/v1/geolocate?key=test')
        const data = await response.json()
        if (data.location) {
          const { lat, lng } = data.location
          // Reverse geocoding
          const geoResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          )
          const geoData = await geoResponse.json()
          const city = geoData.address.city || geoData.address.town || geoData.address.village
          if (city) {
            fetchWeatherByCity(city)
            return
          }
          
          // If we only have country, use the capital city
          if (geoData.address.country) {
            const countryResponse = await fetch(
              `https://restcountries.com/v3.1/name/${geoData.address.country}`
            )
            const countryData = await countryResponse.json()
            if (countryData[0]?.capital?.[0]) {
              fetchWeatherByCity(countryData[0].capital[0])
              return
            }
          }
        }
      } catch (mozillaError) {
        console.error('Mozilla Location Service error:', mozillaError)
      }

      // Secondary: HTML5 Geolocation (GPS)
      if ('geolocation' in navigator) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0
            })
          })

          const { latitude, longitude } = position.coords
          // Reverse geocoding to get city name
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
          const data = await response.json()
          const city = data.address.city || data.address.town || data.address.village
          if (city) {
            fetchWeatherByCity(city)
            return
          }
        } catch (gpsError) {
          console.error('GPS location error:', gpsError)
        }
      }

      // Final fallback: Browser-based location
      try {
        const response = await fetch('https://ipapi.co/json/')
        const data = await response.json()
        if (data.city) {
          fetchWeatherByCity(data.city)
          return
        }
      } catch (browserError) {
        console.error('Browser location error:', browserError)
      }

      // If all location methods fail
      setGeoError('Could not detect your location. Please search for a city manually.')
    } catch (error) {
      console.error('Location detection error:', error)
      setGeoError('Location services unavailable. Please search for a city manually.')
    } finally {
      setGeoLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dynamic Weather Background */}
      {weather && <WeatherBackground weather={weather} />}
      <div className="relative z-10 w-full max-w-5xl mx-auto p-4 md:p-10 flex flex-col gap-10">
        {/* Header with location button */}
        <div className="relative flex items-center gap-4">
          <WeatherHeader
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            handleSearch={handleSearch}
          />
          <button
            onClick={getUserLocation}
            disabled={geoLoading}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors disabled:opacity-50"
            title="Use current location"
          >
            <MapPin className="h-5 w-5 text-white" />
          </button>
        </div>

        {/* Show geolocation error if any */}
        {geoError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-4 rounded-lg bg-red-500/20 p-4 text-center text-white"
          >
            {geoError}
          </motion.div>
        )}

        {showSearch && suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 mt-2 bg-white/80 backdrop-blur-xl rounded-xl shadow-lg z-20 overflow-hidden">
            {suggestions.map((city, idx) => (
              <li
                key={city}
                className={`px-4 py-2 cursor-pointer text-gray-800 hover:bg-blue-100 transition-all ${idx === suggestionIndex ? "bg-blue-200" : ""}`}
                onMouseDown={() => selectSuggestion(city)}
                onMouseEnter={() => setSuggestionIndex(idx)}
              >
                {city}
              </li>
            ))}
          </ul>
        )}

        {/* Main Glassmorphic Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative rounded-3xl bg-white/10 border border-white/30 shadow-2xl backdrop-blur-2xl p-10 flex flex-col md:flex-row gap-10 ring-1 ring-white/20 before:content-[''] before:absolute before:inset-0 before:-z-10 before:rounded-3xl before:bg-gradient-to-br before:from-blue-400/30 before:to-purple-400/20 before:blur-2xl before:opacity-70"
        >
          {/* Main Weather Info */}
          <div className="flex-1 flex flex-col justify-between">
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 rounded-lg bg-red-500/20 p-4 text-center text-white">
                {error}
              </motion.div>
            )}
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white"></div>
              </div>
            ) : weather ? (
              <>
                <h1 className="text-6xl font-extralight text-white drop-shadow-lg tracking-wide capitalize">
                  {weather.weather[0].main}
                </h1>
                <p className="text-2xl text-white/80 mt-2 capitalize">
                  {weather.weather[0].description}
                </p>
                <div className="flex items-end gap-6 mt-10">
                  <span className="text-8xl font-bold text-white drop-shadow-xl">{Math.round(weather.main.temp)}°</span>
                  <span className="text-white/60 text-2xl">{weather.name}</span>
                  <span className="text-white/40 text-lg">UV: 2</span>
                </div>
              </>
            ) : null}
          </div>
          {/* Weather Icon */}
          {weather && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="flex flex-col items-center justify-center">
              <WeatherIcon weather={weather.weather[0]} className="h-40 w-40 text-white drop-shadow-2xl" />
            </motion.div>
          )}
          {/* Details Widgets */}
          {weather && (
            <div className="flex flex-col gap-6 min-w-[200px]">
              <div className="rounded-full bg-white/20 p-4 flex flex-col items-center shadow-lg">
                <span className="text-white/80 flex items-center gap-2">
                  <Wind className="h-5 w-5" /> Wind
                </span>
                <span className="text-white font-bold text-2xl">{weather.wind.speed.toFixed(1)} km/h</span>
              </div>
              <div className="rounded-full bg-white/20 p-4 flex flex-col items-center shadow-lg">
                <span className="text-white/80 flex items-center gap-2">
                  <Sunrise className="h-5 w-5" /> Sunrise
                </span>
                <span className="text-white font-bold text-2xl">
                  {new Date(weather.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="rounded-full bg-white/20 p-4 flex flex-col items-center shadow-lg">
                <span className="text-white/80 flex items-center gap-2">
                  <Sunset className="h-5 w-5" /> Sunset
                </span>
                <span className="text-white font-bold text-2xl">
                  {new Date(weather.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          )}
        </motion.div>
        {/* Forecast Graph */}
        {forecast && <WeatherForecast forecast={forecast} />}
      </div>
    </div>
  )
}
