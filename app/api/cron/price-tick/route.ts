import { NextRequest, NextResponse } from 'next/server'
import { verifyCronSecret } from '@/lib/auth'
import { fetchGoldPrice } from '@/lib/services/price'
import { redis, PRICE_KEY, PRICE_CHANNEL, PRICE_TTL } from '@/lib/redis'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const price = await fetchGoldPrice()
  const db = createAdminClient()

  await db.from('price_ticks').insert({
    ts:         price.ts,
    price:      price.price,
    bid:        price.bid,
    ask:        price.ask,
    change:     price.change,
    change_pct: price.change_pct,
    day_low:    price.day_low,
    day_high:   price.day_high,
    source:     price.source,
  })

  await redis.set(PRICE_KEY, JSON.stringify(price), { ex: PRICE_TTL })
  await redis.publish(PRICE_CHANNEL, JSON.stringify(price))

  return NextResponse.json({ ok: true, price: price.price })
}
