import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDuration(ms) {
  const totalSec = Math.floor(ms / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  return `${min}m ${sec.toString().padStart(2, '0')}s`
}

export function formatWPM(words, durationMs) {
  if (!durationMs || durationMs < 1000) return '0 WPM'
  const minutes = durationMs / 60000
  return `${Math.round(words / minutes)} WPM`
}

export function formatTimestamp(date) {
  const now = new Date()
  const diff = now - new Date(date)
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function getCefrLevel(accuracy, wordsSpoken, mistakes) {
  const score = (accuracy * 0.5) + (Math.min(wordsSpoken / 500, 1) * 30) + (Math.max(0, 20 - mistakes * 2))
  if (score >= 85) return { level: 'C1', desc: 'Advanced' }
  if (score >= 70) return { level: 'B2', desc: 'Upper-Intermediate' }
  if (score >= 55) return { level: 'B1', desc: 'Intermediate' }
  if (score >= 40) return { level: 'A2', desc: 'Elementary' }
  return { level: 'A1', desc: 'Beginner' }
}
