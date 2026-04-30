import { NextResponse } from 'next/server'
import { redis, PRICE_KEY, PRICE_TTL } from '@/lib/redis'
import { fetchGoldPrice } from '@/lib/services/price'
import type { GoldPrice } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET() {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: GoldPrice) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
        } catch { /* client disconnected */ }
      }

      const poll = async () => {
        try {
          // Try Redis cache first
          const cached = await redis.get<string>(PRICE_KEY)
          if (cached) {
            const price: GoldPrice = typeof cached === 'string' ? JSON.parse(cached) : cached
            send(price)
            return
          }
        } catch { /* redis error, fall through */ }

        // No cache — fetch live from Yahoo/GoldAPI
        try {
          const price = await fetchGoldPrice()
          send(price)
          // Cache it for other consumers
          await redis.set(PRICE_KEY, JSON.stringify(price), { ex: PRICE_TTL }).catch(() => {})
        } catch (err) {
          console.error('Price stream fetch error:', err)
        }
      }

      await poll()
      const interval = setInterval(poll, 10_000) // every 10s

      const cleanup = () => {
        clearInterval(interval)
        try { controller.close() } catch { /* already closed */ }
      }

      setTimeout(cleanup, 5 * 60 * 1000)
    },
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection:      'keep-alive',
    },
  })
}
