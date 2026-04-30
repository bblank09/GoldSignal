import Topbar from '@/components/layout/Topbar'
import Sidebar from '@/components/layout/Sidebar'
import type { GoldPrice, MacroSnapshot, DailySignal, NewsCategory } from '@/lib/types'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

const DEFAULT_PRICE: GoldPrice = {
  price: 0, bid: 0, ask: 0, change: 0, change_pct: 0,
  day_low: 0, day_high: 0, source: 'yahoo', live: false, ts: '',
}

const DEFAULT_MACRO: MacroSnapshot = {
  dxy:     { value: 0, change: 0, direction: 'flat', gold_impact: 'mixed' },
  us10y:   { value: 0, change: 0, direction: 'flat', gold_impact: 'mixed' },
  us2y:    { value: 0, change: 0, direction: 'flat', gold_impact: 'mixed' },
  vix:     { value: 0, change: 0, direction: 'flat', gold_impact: 'mixed' },
  sp500:   { value: 0, change: 0, direction: 'flat', gold_impact: 'mixed' },
  oil_wti: { value: 0, change: 0, direction: 'flat', gold_impact: 'mixed' },
  ts: '',
}

const DEFAULT_SIGNAL: DailySignal = {
  date: new Date().toISOString().split('T')[0],
  bias: 'Neutral',
  strength: 3 as 1 | 2 | 3 | 4 | 5,
  buy_zones: [],
  sell_zones: [],
  weekly_outlook: '',
  supporting_factors: [],
  risk_factors: [],
  executive_summary: 'Loading...',
  generated_at: '',
}

async function fetchPrice(): Promise<GoldPrice> {
  try {
    const res = await fetch(`${BASE}/api/price`, { next: { revalidate: 30 } })
    if (!res.ok) throw new Error()
    return res.json()
  } catch { return DEFAULT_PRICE }
}

async function fetchMacro(): Promise<MacroSnapshot> {
  try {
    const res = await fetch(`${BASE}/api/macro`, { next: { revalidate: 300 } })
    if (!res.ok) throw new Error()
    return res.json()
  } catch { return DEFAULT_MACRO }
}

async function fetchSignal(): Promise<DailySignal> {
  try {
    const res = await fetch(`${BASE}/api/signal/daily`, { next: { revalidate: 300 } })
    if (!res.ok) throw new Error()
    return res.json()
  } catch { return DEFAULT_SIGNAL }
}

async function fetchCategories(): Promise<NewsCategory[]> {
  const CATEGORY_META: Record<string, { name: string; color: string; impact: NewsCategory['impact']; gold_dir: NewsCategory['gold_dir'] }> = {
    fed:   { name: 'Fed / Central Bank', color: '#f59e0b', impact: 'HIGH',   gold_dir: 'bull' },
    infl:  { name: 'Inflation',           color: '#ef4444', impact: 'HIGH',   gold_dir: 'bull' },
    dxy:   { name: 'US Dollar / DXY',     color: '#3b82f6', impact: 'HIGH',   gold_dir: 'bear' },
    yield: { name: 'Yields / Bonds',      color: '#8b5cf6', impact: 'HIGH',   gold_dir: 'bear' },
    geo:   { name: 'Geopolitics',         color: '#ec4899', impact: 'MEDIUM', gold_dir: 'bull' },
    etf:   { name: 'ETF Flows',           color: '#10b981', impact: 'MEDIUM', gold_dir: 'bull' },
    cb:    { name: 'Central Bank Buying', color: '#f97316', impact: 'MEDIUM', gold_dir: 'bull' },
    macro: { name: 'Macro / Markets',     color: '#6b7280', impact: 'LOW',    gold_dir: 'mixed' },
    tech:  { name: 'Technical',           color: '#14b8a6', impact: 'LOW',    gold_dir: 'mixed' },
  }
  try {
    const res = await fetch(`${BASE}/api/news?limit=100`, { next: { revalidate: 120 } })
    if (!res.ok) throw new Error()
    const articles = await res.json() as { category_id: string }[]
    const counts: Record<string, number> = {}
    for (const a of articles) {
      counts[a.category_id] = (counts[a.category_id] ?? 0) + 1
    }
    return Object.entries(counts)
      .map(([id, count]) => ({
        id,
        count,
        name:      CATEGORY_META[id]?.name     ?? id,
        color:     CATEGORY_META[id]?.color    ?? '#6b7280',
        impact:    CATEGORY_META[id]?.impact   ?? 'LOW',
        gold_dir:  CATEGORY_META[id]?.gold_dir ?? 'mixed',
      }))
      .sort((a, b) => b.count - a.count)
  } catch {
    return []
  }
}


export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Next.js 14 headers() is async in newer versions, but we can use a simpler approach
  const [price, macro, signal, categories, allArticles] = await Promise.all([
    fetchPrice(),
    fetchMacro(),
    fetchSignal(),
    fetchCategories(),
    fetch(`${BASE}/api/news?limit=100`, { next: { revalidate: 120 } })
      .then(r => r.ok ? r.json() : [])
      .catch(() => []),
  ])

  // Calculate real sentiment from live articles
  let bullish = 0, bearish = 0, neutral = 0
  const validArticles = (Array.isArray(allArticles) ? allArticles : []).filter(a => a?.analysis)
  for (const a of validArticles) {
    if (a.analysis.sentiment === 'Bullish') bullish++
    else if (a.analysis.sentiment === 'Bearish') bearish++
    else if (a.analysis.sentiment === 'Neutral') neutral++
  }
  const total = bullish + bearish + neutral
  const sentiment = total > 0 ? {
    bullish: Math.round((bullish / total) * 100),
    bearish: Math.round((bearish / total) * 100),
    neutral: Math.round((neutral / total) * 100),
  } : { bullish: 0, bearish: 0, neutral: 0 }

  return (
    <div className="flex flex-col" style={{ height: '100vh', overflow: 'hidden', background: 'var(--bg0)' }}>
      <Topbar price={price} activeTab="feed" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          price={price}
          macro={macro}
          signal={signal}
          categories={categories}
          sentiment={sentiment}
          view="feed"
        />
        <main className="flex-1 overflow-hidden flex flex-col">
          {children}
        </main>
      </div>
    </div>
  )
}
