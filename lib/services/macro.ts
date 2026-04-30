import type { MacroSnapshot, MacroValue, Direction, GoldImpact } from '@/lib/types'

interface YahooMeta {
  regularMarketPrice: number
  regularMarketChange?: number
  previousClose?: number
  chartPreviousClose?: number
}

async function fetchYahooQuote(symbol: string): Promise<YahooMeta> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    next: { revalidate: 0 },
  })
  if (!res.ok) throw new Error(`Yahoo ${symbol} ${res.status}`)
  const json = await res.json() as { chart: { result: { meta: YahooMeta }[] } }
  const meta = json.chart.result[0].meta
  return meta
}

function toMacroValue(meta: YahooMeta, goldLogic: (ch: number) => GoldImpact): MacroValue {
  const price = meta.regularMarketPrice
  const prev  = meta.regularMarketChange !== undefined 
    ? price - meta.regularMarketChange 
    : (meta.previousClose ?? meta.chartPreviousClose ?? price)
  
  const change = meta.regularMarketChange ?? (price - prev)
  const dir: Direction = change >= 0 ? 'up' : 'down'

  return {
    value:       +price.toFixed(2),
    change:      +change.toFixed(2),
    direction:   dir,
    gold_impact: goldLogic(change),
  }
}

export async function fetchMacroSnapshot(): Promise<MacroSnapshot> {
  const [dxy, us10y, us2y, vix, sp500, oil] = await Promise.all([
    fetchYahooQuote('DX-Y.NYB'),
    fetchYahooQuote('^TNX'),
    fetchYahooQuote('^IRX'),  // 13-week, closest proxy
    fetchYahooQuote('^VIX'),
    fetchYahooQuote('^GSPC'),
    fetchYahooQuote('CL=F'),
  ])

  return {
    dxy:     toMacroValue(dxy,   (ch) => ch < 0 ? 'bull' : 'bear'),  // DXY down = gold bull
    us10y:   toMacroValue(us10y, (ch) => ch < 0 ? 'bull' : 'bear'),  // yields down = gold bull
    us2y:    toMacroValue(us2y,  (ch) => ch < 0 ? 'bull' : 'bear'),
    vix:     toMacroValue(vix,   (ch) => ch > 0 ? 'bull' : 'neut'),  // VIX up = safe haven
    sp500:   toMacroValue(sp500, ()   => 'neut'),
    oil_wti: toMacroValue(oil,   ()   => 'neut'),
    ts: new Date().toISOString(),
  }
}
