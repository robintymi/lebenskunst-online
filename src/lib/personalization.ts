'use client'

const VIEWED_KEY = 'lk_viewed'
const SEARCH_KEY = 'lk_searches'
const MAX_VIEWED = 20
const MAX_SEARCHES = 8

export interface ViewedItem {
  id: string
  slug: string
  title: string
  itemType: string
  categoryIds: string[]
  viewedAt: number
}

export function trackView(item: ViewedItem) {
  if (typeof window === 'undefined') return
  try {
    const existing: ViewedItem[] = JSON.parse(localStorage.getItem(VIEWED_KEY) || '[]')
    const filtered = existing.filter((v) => v.id !== item.id)
    const updated = [{ ...item, viewedAt: Date.now() }, ...filtered].slice(0, MAX_VIEWED)
    localStorage.setItem(VIEWED_KEY, JSON.stringify(updated))
  } catch {}
}

export function getRecentlyViewed(): ViewedItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(VIEWED_KEY) || '[]')
  } catch {
    return []
  }
}

export function getAffinityCategories(): string[] {
  const viewed = getRecentlyViewed()
  const counts: Record<string, number> = {}
  viewed.forEach((item) => {
    item.categoryIds?.forEach((catId) => {
      counts[catId] = (counts[catId] || 0) + 1
    })
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([catId]) => catId)
}

export function getAffinityTypes(): string[] {
  const viewed = getRecentlyViewed()
  const counts: Record<string, number> = {}
  viewed.forEach((item) => {
    if (item.itemType) counts[item.itemType] = (counts[item.itemType] || 0) + 1
  })
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([type]) => type)
}

export function trackSearch(query: string) {
  if (typeof window === 'undefined' || !query.trim()) return
  try {
    const existing: string[] = JSON.parse(localStorage.getItem(SEARCH_KEY) || '[]')
    const filtered = existing.filter((s) => s.toLowerCase() !== query.toLowerCase())
    const updated = [query, ...filtered].slice(0, MAX_SEARCHES)
    localStorage.setItem(SEARCH_KEY, JSON.stringify(updated))
  } catch {}
}

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(SEARCH_KEY) || '[]')
  } catch {
    return []
  }
}
