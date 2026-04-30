import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { redis, PRICE_KEY, PRICE_TTL } from '@/lib/redis'
import { fetchGoldPrice } from '@/lib/services/price'
import type { GoldPrice } from '@/lib/types'

export async function GET() {
  // Try Redis first
  try {
    const cached = await redis.get<string>(PRICE_KEY)
    if (cached) {
      const price: GoldPrice = typeof cached === 'string' ? JSON.parse(cached) : cached
      return NextResponse.json(price)
    }
  } catch { /* redis error */ }

  // No cache — fetch live directly
  try {
    const price = await fetchGoldPrice()
    // Cache for other consumers
    await redis.set(PRICE_KEY, JSON.stringify(price), { ex: PRICE_TTL }).catch(() => {})
    return NextResponse.json(price)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch price', detail: String(err) }, { status: 503 })
  }
}
