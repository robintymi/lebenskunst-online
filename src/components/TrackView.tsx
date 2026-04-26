'use client'

import { useEffect } from 'react'
import { trackView } from '@/lib/personalization'

interface Props {
  id: string
  slug: string
  title: string
  itemType: string
  categoryIds: string[]
}

export default function TrackView({ id, slug, title, itemType, categoryIds }: Props) {
  useEffect(() => {
    trackView({ id, slug, title, itemType, categoryIds, viewedAt: Date.now() })
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
