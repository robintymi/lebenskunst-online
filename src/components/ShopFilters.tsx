'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useRef } from 'react'
import { itemTypeLabels, itemTypeGroups } from '@/lib/utils'
import styles from './ShopFilters.module.css'

interface Category {
  id: string
  name: string
  slug: string
}

interface Props {
  categories: Category[]
  currentSearch?: string
}

export default function ShopFilters({ categories, currentSearch = '' }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const activeType = searchParams.get('typ') || 'alle'
  const activeCategory = searchParams.get('kategorie') || ''
  const activeView = searchParams.get('ansicht') || ''

  function setFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/shop?${params.toString()}`, { scroll: false })
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set('suche', value)
      } else {
        params.delete('suche')
      }
      router.push(`/shop?${params.toString()}`, { scroll: false })
    }, 400)
  }

  return (
    <div className={styles.filters}>
      <input
        type="search"
        placeholder="Suchen…"
        defaultValue={currentSearch}
        onChange={handleSearchChange}
        className={styles.searchInput}
      />
      {/* Typ-Filter */}
      <div className={styles.filterGroup}>
        <h4 className={styles.filterLabel}>Typ</h4>
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterBtn} ${activeType === 'alle' ? styles.active : ''}`}
            onClick={() => setFilter('typ', '')}
          >
            Alle
          </button>
          {Object.entries(itemTypeGroups).map(([groupName, types]) => (
            <button
              key={groupName}
              className={`${styles.filterBtn} ${types.includes(activeType) ? styles.active : ''}`}
              onClick={() => setFilter('typ', types[0])}
            >
              {groupName}
            </button>
          ))}
        </div>

        {/* Sub-Typ Buttons wenn Gruppe aktiv */}
        {Object.entries(itemTypeGroups).map(([, types]) => {
          if (!types.includes(activeType) || types.length <= 1) return null
          return (
            <div key={types.join(',')} className={styles.subFilters}>
              {types.map((type) => (
                <button
                  key={type}
                  className={`${styles.subBtn} ${activeType === type ? styles.active : ''}`}
                  onClick={() => setFilter('typ', type)}
                >
                  {itemTypeLabels[type]}
                </button>
              ))}
            </div>
          )
        })}
      </div>

      {/* Themenbundles */}
      {categories.length > 0 && (
        <div className={styles.filterGroup}>
          <h4 className={styles.filterLabel}>Themenbundles</h4>
          <div className={styles.filterButtons}>
            <button
              className={`${styles.filterBtn} ${!activeCategory && !activeView ? styles.active : ''}`}
              onClick={() => {
                setFilter('kategorie', '')
                setFilter('ansicht', '')
              }}
            >
              Alle
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.filterBtn} ${activeCategory === cat.slug ? styles.active : ''}`}
                onClick={() => {
                  setFilter('ansicht', 'bundles')
                  setFilter('kategorie', cat.slug)
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
