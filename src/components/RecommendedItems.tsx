'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getAffinityTypes, getAffinityCategories, getRecentlyViewed } from '@/lib/personalization'
import styles from './RecommendedItems.module.css'

interface ShopItem {
  id: string
  title: string
  slug: string
  itemType: string
  pricing?: { price?: number; isFree?: boolean }
  image?: { url?: string; sizes?: { thumbnail?: { url?: string } } }
  shortDescription?: string
}

interface Props {
  allItems: ShopItem[]
  currentItemId?: string
  purchasedItemIds?: string[]
}

const typeLabels: Record<string, string> = {
  seminar: 'Seminar', workshop: 'Workshop', vortrag: 'Vortrag',
  einzeltraining: 'Einzeltraining', video: 'Video', audio: 'Audio',
  begleitmaterial: 'Begleitmaterial', buch: 'Buch', kunst: 'Kunstwerk',
}

export default function RecommendedItems({ allItems, currentItemId, purchasedItemIds = [] }: Props) {
  const [recommended, setRecommended] = useState<ShopItem[]>([])
  const [label, setLabel] = useState('')

  useEffect(() => {
    const viewed = getRecentlyViewed()
    const affinityTypes = getAffinityTypes()
    const affinityCategories = getAffinityCategories()
    const viewedIds = new Set(viewed.map((v) => v.id))

    const excluded = new Set([...(currentItemId ? [currentItemId] : []), ...purchasedItemIds])

    const candidates = allItems.filter((item) => !excluded.has(item.id))

    if (candidates.length === 0) return

    // Score each item
    const scored = candidates.map((item) => {
      let score = 0
      // Type affinity
      const typeRank = affinityTypes.indexOf(item.itemType)
      if (typeRank !== -1) score += Math.max(5 - typeRank, 1) * 3
      // Viewed items boost category
      if (viewedIds.has(item.id)) score -= 10 // demote already viewed
      // Featured boost
      if ((item as any).featured) score += 2
      // Random spread (prevents always same order)
      score += Math.random() * 2
      return { item, score }
    })

    scored.sort((a, b) => b.score - a.score)
    const top = scored.slice(0, 4).map((s) => s.item)

    if (top.length === 0) return

    setRecommended(top)

    if (affinityTypes.length > 0) {
      setLabel(`Passend zu deinem Interesse an ${typeLabels[affinityTypes[0]] || 'deinen Themen'}`)
    } else if (currentItemId) {
      setLabel('Das könnte dich auch interessieren')
    } else {
      setLabel('Empfohlen für dich')
    }
  }, [allItems, currentItemId, purchasedItemIds])

  if (recommended.length === 0) return null

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>{label}</h2>
      <div className={styles.grid}>
        {recommended.map((item) => {
          const imgUrl =
            item.image?.sizes?.thumbnail?.url ||
            item.image?.url ||
            null
          const price = item.pricing?.isFree
            ? 'Kostenlos'
            : item.pricing?.price != null
              ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(item.pricing.price)
              : ''

          return (
            <Link key={item.id} href={`/shop/${item.slug}`} className={styles.card}>
              <div className={styles.imageWrap}>
                {imgUrl ? (
                  <Image src={imgUrl} alt={item.title} fill className={styles.image} sizes="180px" />
                ) : (
                  <div className={styles.placeholder} />
                )}
              </div>
              <div className={styles.info}>
                <span className={styles.type}>{typeLabels[item.itemType] || item.itemType}</span>
                <p className={styles.title}>{item.title}</p>
                {price && <span className={styles.price}>{price}</span>}
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
