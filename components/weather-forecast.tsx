"use client"

import { motion } from "framer-motion"
import type { ForecastType } from "@/types/weather"
import { getWeatherIcon } from "@/lib/weather-icons"

interface WeatherForecastProps {
  forecast: ForecastType[]
}

export function WeatherForecast({ forecast }: WeatherForecastProps) {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.6 }}
      className="mt-8"
    >
      <div className="flex justify-between">
        {forecast.map((day, index) => {
          const date = new Date(day.dt * 1000)
          const dayName = days[date.getDay()]
          const WeatherIcon = getWeatherIcon(day.weather[0].main)

          return (
            <div key={index} className="flex flex-col items-center">
              <p className="text-sm text-white/80">{dayName}</p>
              <p className="mt-1 text-2xl font-bold text-white">{Math.round(day.temp.day)}°</p>
              <div className="my-2 flex h-10 w-10 items-center justify-center">
                <WeatherIcon className="h-8 w-8 text-white" />
              </div>
            </div>
          )
        })}
      </div>

      <div className="relative mt-4 h-20">
        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-white/20"></div>
        {forecast.map((day, index) => {
          const position = (index / (forecast.length - 1)) * 100
          const height = Math.min(Math.max(day.temp.day / 40, 0.2), 0.8) * 100

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.5)]"
              style={{ left: `${position}%` }}
            >
              {index > 0 && index < forecast.length - 1 && (
                <div
                  className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-sm"
                  style={{
                    height: `${height}%`,
                    width: `${height}%`,
                    minHeight: "16px",
                    minWidth: "16px",
                  }}
                />
              )}
            </motion.div>
          )
        })}

        <svg
          className="absolute left-0 top-1/2 h-20 w-full -translate-y-1/2 pointer-events-none"
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path
            d={`M0,10 ${forecast
              .map((day, i) => {
                const x = (i / (forecast.length - 1)) * 100
                const y = 10 - (day.temp.day / 40) * 8
                return `L${x},${y}`
              })
              .join(" ")}`}
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            filter="url(#glow)"
          />
        </svg>
      </div>
    </motion.div>
  )
}
