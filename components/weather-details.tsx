"use client"

import { motion } from "framer-motion"
import type { WeatherType } from "@/types/weather"

interface WeatherDetailsProps {
  weather: WeatherType
}

export function WeatherDetails({ weather }: WeatherDetailsProps) {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="rounded-xl bg-white/10 p-4 backdrop-blur-md"
    >
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-medium text-white/90">Wind status</h3>
        <p className="text-lg font-semibold text-white">
          {weather.wind.speed.toFixed(2)}
          <span className="ml-1 text-sm">km/h</span>
        </p>
      </div>
      <div className="h-16">
        <svg viewBox="0 0 200 50" className="h-full w-full">
          <path d="M0,25 Q50,5 100,25 T200,25" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
          <path d="M0,25 Q50,45 100,25 T200,25" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
        </svg>
      </div>
      <div className="mt-2 flex justify-between">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="h-8 w-1 rounded-full bg-white/30"
            style={{
              height: `${Math.random() * 20 + 5}px`,
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}
