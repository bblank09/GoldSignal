import { NextRequest, NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import type { Candle } from '@/lib/types'

export const dynamic = 'force-dynamic'

interface YahooQuote {
  open:   (number | null)[]
  high:   (number | null)[]
  low:    (number | null)[]
  close:  (number | null)[]
  volume: (number | null)[]
}

interface YahooChartResult {
  timestamp: number[]
  indicators: { quote: YahooQuote[] }
}

interface YahooResponse {
  chart: { result: YahooChartResult[] | null; error: unknown }
}

const INTERVAL_CONFIG: Record<string, { yahooInterval: string; range: string }> = {
  '1d':  { yahooInterval: '1d',  range: '6mo'  },
  '60m': { yahooInterval: '60m', range: '5d'   },
  '15m': { yahooInterval: '15m', range: '1d'   },
}

async function fetchYahooCandles(yahooInterval: string, range: string): Promise<Candle[]> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=${yahooInterval}&range=${range}`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    next: { revalidate: 0 },
  })
  if (!res.ok) throw new Error(`Yahoo Finance ${res.status}`)

  const json = await res.json() as YahooResponse
  const result = json.chart.result?.[0]
  if (!result) throw new Error('No chart result from Yahoo Finance')

  const { timestamp, indicators } = result
  const quote = indicators.quote[0]

  const candles: Candle[] = []
  for (let i = 0; i < timestamp.length; i++) {
    const o = quote.open[i]
    const h = quote.high[i]
    const l = quote.low[i]
    const c = quote.close[i]
    const v = quote.volume[i]
    // Skip bars with null OHLC
    if (o === null || h === null || l === null || c === null) continue
    const time = new Date(timestamp[i] * 1000).toISOString().split('T')[0]
    candles.push({ time, open: o, high: h, low: l, close: c, volume: v ?? 0 })
  }

  // Sort ascending and deduplicate by time (keep last)
  const deduped = new Map<string, Candle>()
  for (const c of candles) deduped.set(c.time, c)
  return Array.from(deduped.values()).sort((a, b) => a.time.localeCompare(b.time))
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const interval = searchParams.get('interval') ?? '1d'
  const cfg = INTERVAL_CONFIG[interval] ?? INTERVAL_CONFIG['1d']

  const cacheKey = `gs:chart:candles:${interval}`

  // Try Redis cache first
  try {
    const cached = await redis.get<string>(cacheKey)
    if (cached) {
      const candles: Candle[] = typeof cached === 'string' ? JSON.parse(cached) : cached
      return NextResponse.json(candles)
    }
  } catch { /* ignore Redis errors */ }

  // Fetch fresh from Yahoo Finance
  const candles = await fetchYahooCandles(cfg.yahooInterval, cfg.range)

  // Cache for 300s
  try {
    await redis.set(cacheKey, JSON.stringify(candles), { ex: 300 })
  } catch { /* ignore */ }

  return NextResponse.json(candles)
}
