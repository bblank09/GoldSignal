import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Candle } from '@/lib/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const limit = Math.min(Number(searchParams.get('limit') ?? '90'), 500)

  const db = createAdminClient()
  const { data, error } = await db
    .from('price_ticks')
    .select('price, ts')
    .order('ts', { ascending: false })
    .limit(limit)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Convert ticks to OHLC candles (1-tick-per-candle for daily approximation)
  const candles: Candle[] = (data ?? [])
    .reverse()
    .map((row) => {
      const p = row.price as number
      const t = (row.ts as string).split('T')[0]
      return { time: t, open: p, high: p, low: p, close: p, volume: 0 }
    })

  return NextResponse.json(candles)
}
