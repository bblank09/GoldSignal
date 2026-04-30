import { NextRequest, NextResponse } from 'next/server'
import { verifyCronSecret } from '@/lib/auth'
import { runDailySignal } from '@/lib/services/daily-signal'
import { redis, PRICE_KEY } from '@/lib/redis'
import type { GoldPrice } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!verifyCronSecret(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const raw = await redis.get<string>(PRICE_KEY)
  const price: GoldPrice | null = raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : null
  const currentPrice = price?.price ?? 3300

  const signal = await runDailySignal(currentPrice)
  return NextResponse.json({ ok: true, signal })
}
