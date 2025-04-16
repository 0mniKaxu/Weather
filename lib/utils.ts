import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  const day = date.getDate()
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const month = monthNames[date.getMonth()]

  const hours = date.getHours()
  const minutes = date.getMinutes()
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes

  return `${day} ${month} | ${hours}:${formattedMinutes}`
}
