import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

import { isMockMode } from '@/lib/mock-mode'
import { mockGoldPrice } from '@/lib/mock-data'
import { redis, PRICE_KEY, PRICE_TTL } from '@/lib/redis'
import { fetchGoldPrice } from '@/lib/services/price'
import type { GoldPrice } from '@/lib/types'

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder()

  // ── Mock mode (default): simulate live price movement ─────────────────────
  if (isMockMode()) {
    let base = mockGoldPrice.price
    let cancelled = false

    const stream = new ReadableStream({
      start(controller) {
        const send = (data: GoldPrice) => {
          if (cancelled) return
          try { controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`)) }
          catch { cancelled = true }
        }

        // Send immediately then every 5s with tiny random walk
        const tick = () => {
          if (cancelled) return
          const delta = (Math.random() - 0.48) * 2.5      // small drift ±$2.5
          base = Math.round((base + delta) * 100) / 100
          const change = Math.round((base - mockGoldPrice.price) * 100) / 100
          send({
            ...mockGoldPrice,
            price: base,
            change,
            change_pct: Math.round((change / mockGoldPrice.price) * 10000) / 100,
            ts: new Date().toISOString(),
          })
        }

        tick()
        const interval = setInterval(tick, 5_000)
        const timeout  = setTimeout(() => { cancelled = true; clearInterval(interval); try { controller.close() } catch {} }, 5 * 60 * 1000)

        req.signal.addEventListener('abort', () => {
          cancelled = true
          clearInterval(interval)
          clearTimeout(timeout)
          try { controller.close() } catch {}
        })
      },
    })

    return new NextResponse(stream, {
      headers: {
        'Content-Type':  'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection':    'keep-alive',
      },
    })
  }

  // ── Live mode ─────────────────────────────────────────────────────────────
  const stream = new ReadableStream({
    async start(controller) {
      let closed = false

      const send = (data: GoldPrice) => {
        if (closed) return
        try { controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`)) }
        catch { closed = true }
      }

      const cleanup = () => {
        if (closed) return
        closed = true
        clearInterval(interval)
        clearTimeout(timeout)
        try { controller.close() } catch {}
      }

      const poll = async () => {
        if (closed) return
        try {
          const cached = await redis.get<string>(PRICE_KEY)
          if (cached) {
            const price: GoldPrice = typeof cached === 'string' ? JSON.parse(cached) : cached
            send(price)
            return
          }
        } catch { /* redis unavailable */ }

        try {
          const price = await fetchGoldPrice()
          send(price)
          await redis.set(PRICE_KEY, JSON.stringify(price), { ex: PRICE_TTL }).catch(() => {})
        } catch { /* skip tick */ }
      }

      await poll()
      const interval = setInterval(poll, 10_000)
      const timeout  = setTimeout(cleanup, 5 * 60 * 1000)
      req.signal.addEventListener('abort', cleanup)
    },
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection':    'keep-alive',
    },
  })
}
