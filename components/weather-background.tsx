"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { WeatherType } from "@/types/weather"

interface WeatherBackgroundProps {
  weather: WeatherType | null
}

export function WeatherBackground({ weather }: WeatherBackgroundProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !weather) return null

  const getBackgroundByWeather = () => {
    const main = weather.weather[0].main.toLowerCase()

    switch (main) {
      case "clear":
        return {
          className: "bg-gradient-to-br from-blue-400 to-blue-600",
          overlay: (
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-yellow-300 opacity-70 blur-3xl" />
              <div className="absolute right-1/4 top-1/4 h-64 w-64 rounded-full bg-white opacity-30 blur-3xl" />
              <svg className="absolute left-1/2 top-1/3 -translate-x-1/2" width="200" height="200" viewBox="0 0 200 200">
                <g className="animate-spin-slow origin-center">
                  {[...Array(12)].map((_, i) => (
                    <rect key={i} x="98" y="10" width="4" height="30" fill="#fff8" rx="2" transform={`rotate(${i*30} 100 100)`} />
                  ))}
                </g>
              </svg>
            </div>
          ),
        }
      case "clouds":
        return {
          className: "bg-gradient-to-br from-blue-400 to-blue-600",
          overlay: (
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-yellow-300 opacity-50 blur-3xl" />
              <div className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-white opacity-60 blur-3xl" />
              <div className="absolute left-1/4 top-1/4 h-48 w-48 rounded-full bg-white opacity-60 blur-3xl" />
            </div>
          ),
        }
      case "rain":
      case "drizzle":
        return {
          className: "bg-gradient-to-br from-gray-600 to-gray-800",
          overlay: (
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute left-1/4 top-1/4 h-48 w-48 rounded-full bg-blue-200 opacity-20 blur-3xl" />
              <div className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-blue-300 opacity-20 blur-3xl" />
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 200">
                {[...Array(20)].map((_, i) => (
                  <rect key={i} x={20*i} y={Math.random()*100} width="2" height="30" fill="#aee4fa" opacity="0.5" rx="1">
                    <animate attributeName="y" values="0;180" dur="1.2s" repeatCount="indefinite" begin={`${i*0.1}s`} />
                  </rect>
                ))}
              </svg>
            </div>
          ),
        }
      case "thunderstorm":
        return {
          className: "bg-gradient-to-br from-gray-700 to-gray-900",
          overlay: (
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute left-1/3 top-1/4 h-64 w-64 rounded-full bg-gray-500 opacity-70 blur-3xl" />
              <div className="absolute right-1/4 top-1/3 h-72 w-72 rounded-full bg-gray-600 opacity-70 blur-3xl" />
              <div className="lightning-animation absolute inset-0" />
            </div>
          ),
        }
      case "snow":
        return {
          className: "bg-gradient-to-br from-gray-300 to-blue-200",
          overlay: (
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute left-1/4 top-1/4 h-48 w-48 rounded-full bg-white opacity-70 blur-3xl" />
              <div className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-white opacity-70 blur-3xl" />
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 200">
                {[...Array(16)].map((_, i) => (
                  <circle key={i} cx={25*i+10} cy={Math.random()*100} r={Math.random()*2+1} fill="#fff" opacity="0.7">
                    <animate attributeName="cy" values="0;200" dur="2s" repeatCount="indefinite" begin={`${i*0.2}s`} />
                  </circle>
                ))}
              </svg>
            </div>
          ),
        }
      case "mist":
      case "fog":
      case "haze":
        return {
          className: "bg-gradient-to-br from-gray-400 to-gray-600",
          overlay: (
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-white opacity-30 blur-3xl" />
              <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-white opacity-40 blur-3xl" />
              <div className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-white opacity-40 blur-3xl" />
            </div>
          ),
        }
      default:
        return {
          className: "bg-gradient-to-br from-blue-500 to-blue-700",
          overlay: (
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-yellow-300 opacity-50 blur-3xl" />
            </div>
          ),
        }
    }
  }

  const { className, overlay } = getBackgroundByWeather()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={weather.weather[0].main}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        className={`absolute inset-0 ${className}`}
      >
        {overlay}
        <div className="absolute inset-0 bg-black/10" />
      </motion.div>
    </AnimatePresence>
  )
}
