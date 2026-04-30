'use client'

import { useEffect, useRef, useState } from 'react'
import type { GoldPrice } from '@/lib/types'

const MAX_BACKOFF_MS = 30_000

export function usePriceStream(fallback: GoldPrice) {
  const [price, setPrice]   = useState<GoldPrice>(fallback)
  const backoffRef           = useRef(1000)
  const timerRef             = useRef<ReturnType<typeof setTimeout> | null>(null)
  const esRef                = useRef<EventSource | null>(null)

  useEffect(() => {
    let cancelled = false

    function connect() {
      if (cancelled) return

      const es = new EventSource('/api/price/stream')
      esRef.current = es

      es.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data) as GoldPrice
          setPrice(data)
          backoffRef.current = 1000  // reset on successful message
        } catch { /* ignore parse errors */ }
      }

      es.onerror = () => {
        es.close()
        esRef.current = null
        if (cancelled) return
        // Exponential backoff — cap at 30s
        const delay = backoffRef.current
        backoffRef.current = Math.min(delay * 2, MAX_BACKOFF_MS)
        timerRef.current = setTimeout(() => {
          if (!cancelled) connect()
        }, delay)
      }
    }

    connect()

    return () => {
      cancelled = true
      if (timerRef.current) clearTimeout(timerRef.current)
      if (esRef.current)    { esRef.current.close(); esRef.current = null }
    }
  }, [])   // mount once — fallback is stable

  return price
}
