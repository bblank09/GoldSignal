import type { GoldPrice } from '@/lib/types'

// ─── goldapi.io ────────────────────────────────────────────────────────────────
async function fetchGoldAPI(): Promise<GoldPrice> {
  const res = await fetch('https://www.goldapi.io/api/XAU/USD', {
    headers: {
      'x-access-token': process.env.GOLDAPI_KEY!,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 0 },
  })
  if (!res.ok) throw new Error(`goldapi.io ${res.status}`)
  const d = await res.json() as {
    price: number; bid: number; ask: number; ch: number; chp: number;
    low_price: number; high_price: number;
  }
  return {
    price:      d.price,
    bid:        d.bid,
    ask:        d.ask,
    change:     d.ch,
    change_pct: d.chp,
    day_low:    d.low_price,
    day_high:   d.high_price,
    source:     'goldapi.io',
    live:       true,
    ts:         new Date().toISOString(),
  }
}

// ─── Yahoo Finance fallback ────────────────────────────────────────────────────
async function fetchYahoo(): Promise<GoldPrice> {
  const url = 'https://query1.finance.yahoo.com/v8/finance/chart/GC=F?interval=1m&range=1d'
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    next: { revalidate: 0 },
  })
  if (!res.ok) throw new Error(`Yahoo Finance ${res.status}`)
  const json = await res.json() as {
    chart: {
      result: {
        meta: {
          regularMarketPrice: number;
          bid?: number; ask?: number;
          regularMarketChange: number;
          regularMarketChangePercent: number;
          regularMarketDayLow: number;
          regularMarketDayHigh: number;
        }
      }[]
    }
  }
  const m = json.chart.result[0].meta
  return {
    price:      m.regularMarketPrice,
    bid:        m.bid ?? m.regularMarketPrice,
    ask:        m.ask ?? m.regularMarketPrice,
    change:     m.regularMarketChange,
    change_pct: m.regularMarketChangePercent,
    day_low:    m.regularMarketDayLow,
    day_high:   m.regularMarketDayHigh,
    source:     'yahoo',
    live:       true,
    ts:         new Date().toISOString(),
  }
}

// ─── Public API: try goldapi first, fall back to Yahoo ─────────────────────────
export async function fetchGoldPrice(): Promise<GoldPrice> {
  try {
    return await fetchGoldAPI()
  } catch {
    return await fetchYahoo()
  }
}
