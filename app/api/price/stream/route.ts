import { NextRequest, NextResponse } from 'next/server'
import { redis, PRICE_KEY, PRICE_TTL } from '@/lib/redis'
import { fetchGoldPrice } from '@/lib/services/price'
import type { GoldPrice } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false

      const send = (data: GoldPrice) => {
        if (closed) return
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
        } catch { closed = true }
      }

      const cleanup = () => {
        if (closed) return
        closed = true
        clearInterval(interval)
        clearTimeout(timeout)
        try { controller.close() } catch { /* already closed */ }
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
        } catch { /* redis unavailable — fall through to live fetch */ }

        try {
          const price = await fetchGoldPrice()
          send(price)
          // Cache so cron tick and other consumers benefit
          await redis.set(PRICE_KEY, JSON.stringify(price), { ex: PRICE_TTL }).catch(() => {})
        } catch { /* network error — skip this tick */ }
      }

      await poll()
      const interval = setInterval(poll, 10_000)

      // Auto-close after 5 minutes to prevent zombie connections
      const timeout = setTimeout(cleanup, 5 * 60 * 1000)

      // Abort when client disconnects
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
