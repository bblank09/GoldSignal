'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { GoldPrice, MacroSnapshot, DailySignal, NewsCategory, ArticleWithAnalysis } from '@/lib/types'
import GoldPriceTicker from '@/components/sidebar/GoldPriceTicker'
import MacroBar from '@/components/sidebar/MacroBar'
import DailyBiasCard from '@/components/sidebar/DailyBiasCard'
import SentimentGauge from '@/components/sidebar/SentimentGauge'
import QuickSignal from '@/components/sidebar/QuickSignal'
import NewsCategoryList from '@/components/sidebar/NewsCategoryList'
import { useUIStore } from '@/lib/store/ui-store'

const DEFAULT_PRICE: GoldPrice = {
  price: 0, bid: 0, ask: 0, change: 0, change_pct: 0,
  day_low: 0, day_high: 0, source: 'yahoo', live: false, ts: '',
}

const DEFAULT_MACRO: MacroSnapshot = {
  dxy:     { value: 0, change: 0, direction: 'flat', gold_impact: 'neut' },
  us10y:   { value: 0, change: 0, direction: 'flat', gold_impact: 'neut' },
  us2y:    { value: 0, change: 0, direction: 'flat', gold_impact: 'neut' },
  vix:     { value: 0, change: 0, direction: 'flat', gold_impact: 'neut' },
  sp500:   { value: 0, change: 0, direction: 'flat', gold_impact: 'neut' },
  oil_wti: { value: 0, change: 0, direction: 'flat', gold_impact: 'neut' },
  ts: '',
}

const DEFAULT_SIGNAL: DailySignal = {
  date: '',
  bias: 'Neutral',
  strength: 3,
  buy_zones: [],
  sell_zones: [],
  weekly_outlook: '',
  supporting_factors: [],
  risk_factors: [],
  executive_summary: 'Loading…',
  generated_at: '',
}

const CATEGORY_META: Record<string, { name: string; color: string }> = {
  fed:   { name: 'Central Bank Policy', color: '#EF4444' },
  dxy:   { name: 'USD / DXY',           color: '#F59E0B' },
  infl:  { name: 'Inflation Data',      color: '#F59E0B' },
  geo:   { name: 'Geopolitical Risk',   color: '#A78BFA' },
  yield: { name: 'Treasury Yields',     color: '#3B82F6' },
  etf:   { name: 'ETF & Flows',         color: '#22C55E' },
  cb:    { name: 'Central Bank Buying', color: '#D4A843' },
  tech:  { name: 'Technical Breakout',  color: '#64748B' },
  cot:   { name: 'COT Positioning',     color: '#94A3B8' },
  macro: { name: 'Macro / Growth Data', color: '#6366F1' },
}

function deriveCategories(articles: ArticleWithAnalysis[]): NewsCategory[] {
  const map = new Map<string, { count: number; impact: string; gold_dir: string }>()
  for (const a of articles) {
    const existing = map.get(a.category_id)
    if (!existing) {
      map.set(a.category_id, {
        count: 1,
        impact: a.analysis.impact_level,
        gold_dir: a.analysis.impact_direction === 'positive' ? 'bull'
          : a.analysis.impact_direction === 'negative' ? 'bear' : 'mixed',
      })
    } else {
      existing.count++
      if (a.analysis.impact_level === 'HIGH') existing.impact = 'HIGH'
      else if (a.analysis.impact_level === 'MEDIUM' && existing.impact === 'LOW') existing.impact = 'MEDIUM'
    }
  }
  return Array.from(map.entries()).map(([id, v]) => ({
    id,
    name:     CATEGORY_META[id]?.name  ?? id,
    color:    CATEGORY_META[id]?.color ?? '#94A3B8',
    count:    v.count,
    impact:   v.impact as NewsCategory['impact'],
    gold_dir: v.gold_dir as NewsCategory['gold_dir'],
  }))
}

function deriveSentiment(articles: ArticleWithAnalysis[]) {
  if (articles.length === 0) return { bullish: 0, bearish: 0, neutral: 100 }
  let bull = 0, bear = 0
  for (const a of articles) {
    if (a.analysis.sentiment === 'Bullish') bull++
    else if (a.analysis.sentiment === 'Bearish') bear++
  }
  const total = articles.length
  const b = Math.round((bull / total) * 100)
  const r = Math.round((bear / total) * 100)
  return { bullish: b, bearish: r, neutral: Math.max(0, 100 - b - r) }
}

export default function Sidebar() {
  const { activeCategoryId, setActiveCategoryId } = useUIStore()
  const pathname = usePathname()
  const isFeed = pathname === '/' || pathname === ''

  const [price, setPrice]       = useState<GoldPrice>(DEFAULT_PRICE)
  const [macro, setMacro]       = useState<MacroSnapshot>(DEFAULT_MACRO)
  const [signal, setSignal]     = useState<DailySignal>(DEFAULT_SIGNAL)
  const [categories, setCategories] = useState<NewsCategory[]>([])
  const [sentiment, setSentiment]   = useState({ bullish: 0, bearish: 0, neutral: 0 })

  useEffect(() => {
    fetch('/api/price')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setPrice(d) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetch('/api/macro')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setMacro(d) })
      .catch(() => {})

    fetch('/api/signal/daily')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d?.bias) setSignal(d) })
      .catch(() => {})

    fetch('/api/news?limit=50')
      .then((r) => r.ok ? r.json() : [])
      .then((articles: ArticleWithAnalysis[]) => {
        if (Array.isArray(articles) && articles.length > 0) {
          setCategories(deriveCategories(articles))
          setSentiment(deriveSentiment(articles))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div
      className="flex-shrink-0 flex flex-col overflow-hidden"
      style={{ width: 260, background: 'var(--bg1)', borderRight: '1px solid var(--bdr)' }}
    >
      <div className="overflow-y-auto flex-1">
        <GoldPriceTicker price={price} />
        <MacroBar macro={macro} />
        <DailyBiasCard signal={signal} />
        <SentimentGauge
          bullish={sentiment.bullish}
          bearish={sentiment.bearish}
          neutral={sentiment.neutral}
        />
        <QuickSignal signal={signal} />
        {isFeed && categories.length > 0 && (
          <NewsCategoryList
            categories={categories}
            activeId={activeCategoryId}
            onSelect={setActiveCategoryId}
          />
        )}
      </div>
    </div>
  )
}
