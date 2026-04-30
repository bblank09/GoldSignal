'use client'

import { useEffect, useRef, useState } from 'react'
import type { GoldPrice } from '@/lib/types'

export function usePriceStream(fallback: GoldPrice) {
  const [price, setPrice] = useState<GoldPrice>(fallback)
  const esRef = useRef<EventSource | null>(null)

  useEffect(() => {
    const es = new EventSource('/api/price/stream')
    esRef.current = es

    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data) as GoldPrice
        setPrice(data)
      } catch { /* ignore parse errors */ }
    }

    return () => {
      es.close()
      esRef.current = null
    }
  }, [])

  return price
}
