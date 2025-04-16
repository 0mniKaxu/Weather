"use client"

import type React from "react"

import { Search, Cloud, LayoutGrid, Bell } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { formatDate } from "@/lib/utils"

interface WeatherHeaderProps {
  showSearch: boolean
  setShowSearch: (show: boolean) => void
  searchInput: string
  setSearchInput: (input: string) => void
  handleSearch: (e: React.FormEvent) => void
}

export function WeatherHeader({
  showSearch,
  setShowSearch,
  searchInput,
  setSearchInput,
  handleSearch,
}: WeatherHeaderProps) {
  const currentDate = formatDate(new Date())

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-white/90">
        <Cloud className="h-5 w-5" />
        <span className="text-sm font-medium">forecast now</span>
      </div>

      <div className="flex items-center gap-4">
        <AnimatePresence mode="wait">
          {showSearch ? (
            <motion.form
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "200px", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSearch}
              className="relative"
            >
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search city..."
                className="w-full rounded-full bg-white/10 px-4 py-1 text-sm text-white placeholder-white/50 backdrop-blur-md focus:outline-none"
                autoFocus
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                <Search className="h-4 w-4 text-white/70" />
              </button>
            </motion.form>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowSearch(true)}
              className="rounded-full bg-white/10 p-2 backdrop-blur-md"
            >
              <Search className="h-4 w-4 text-white" />
            </motion.button>
          )}
        </AnimatePresence>

        <button className="rounded-full bg-white/10 p-2 backdrop-blur-md">
          <LayoutGrid className="h-4 w-4 text-white" />
        </button>

        <button className="rounded-full bg-white/10 p-2 backdrop-blur-md">
          <Bell className="h-4 w-4 text-white" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-white/90">{currentDate}</span>
        <div className="flex items-center gap-2">
          <img
            src="/placeholder-user.jpg"
            alt="User"
            className="h-8 w-8 rounded-full border border-white/20 object-cover"
          />
          <div className="hidden flex-col text-xs sm:flex">
            <span className="font-medium text-white">Sam Ross</span>
            <span className="text-white/70">Admin</span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white/70"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>
    </div>
  )
}
