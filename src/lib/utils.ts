import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isYouTubeUrl(value?: string) {
  return typeof value === "string" && /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/.test(value)
}

export function getYouTubeEmbedUrl(value: string) {
  const idMatch = value.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/)
  const id = idMatch?.[1]
  if (!id) return value
  return `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1`
}
