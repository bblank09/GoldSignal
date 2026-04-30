'use client'

import { useState, useEffect, useMemo } from 'react'
import PredictionStrip from '@/components/signals/PredictionStrip'
import StatCard from '@/components/signals/StatCard'
import ZonePanel from '@/components/signals/ZonePanel'
import WeeklyOutlook from '@/components/signals/WeeklyOutlook'
import RiskFactors from '@/components/signals/RiskFactors'
import EconomicCalendar from '@/components/signals/EconomicCalendar'
import BiasBadge from '@/components/ui/BiasBadge'
import StrengthBars from '@/components/ui/StrengthBars'
import { usePriceStream } from '@/lib/hooks/use-price-stream'
import { buildPredictionsFromSignal } from '@/lib/build-predictions'
import { formatPrice } from '@/lib/format'
import type { PredictionTF, ImpactLevel, DailySignal, EconomicEvent, ArticleWithAnalysis } from '@/lib/types'

const DEFAULT_PRICE = { price: 0, bid: 0, ask: 0, change: 0, change_pct: 0, day_low: 0, day_high: 0, source: 'yahoo' as const, live: false, ts: '' }

const KEY_EVENTS: { date: string; event: string; imp: ImpactLevel; note: string }[] = [
  { date: 'Wed Apr 30', event: 'US CPI',           imp: 'HIGH',   note: 'Hot print = bearish; miss = rally' },
  { date: 'Wed Apr 30', event: 'Powell Speech',    imp: 'HIGH',   note: 'Dovish pivot signal = +$40–$60' },
  { date: 'Fri May 2',  event: 'Non-Farm Payrolls',imp: 'HIGH',   note: 'Weak NFP = Fed cut closer = bull' },
  { date: 'Wed May 21', event: 'FOMC Minutes',     imp: 'HIGH',   note: 'Most important May event' },
]

export default function SignalsPage() {
  const price = usePriceStream(DEFAULT_PRICE)
  const [signal, setSignal]     = useState<DailySignal | null>(null)
  const [events, setEvents]     = useState<EconomicEvent[]>([])
  const [articles, setArticles] = useState<ArticleWithAnalysis[]>([])
  const [selectedTF, setSelectedTF] = useState<PredictionTF>('1D')
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    Promise.allSettled([
      fetch('/api/signal/daily').then((r) => r.ok ? r.json() : null).then((d) => { if (d) setSignal(d) }),
      fetch('/api/calendar?days=14').then((r) => r.ok ? r.json() : null).then((d) => { if (d) setEvents(d) }),
      fetch('/api/news?limit=50').then((r) => r.ok ? r.json() : null).then((d) => { if (d) setArticles(d) }),
    ]).finally(() => setLoading(false))
  }, [])

  const predictions = useMemo(() => {
    if (!signal || !price.price) return []
    return buildPredictionsFromSignal(signal, price.price)
  }, [signal, price.price])

  const bullish  = articles.filter((a) => a.analysis?.sentiment === 'Bullish').length
  const bearish  = articles.filter((a) => a.analysis?.sentiment === 'Bearish').length
  const neutral  = articles.filter((a) => a.analysis?.sentiment === 'Neutral').length
  const total    = bullish + bearish + neutral
  const bullPct  = total > 0 ? Math.round((bullish / total) * 100) : 0
  const avgImpact = total > 0
    ? (articles.reduce((s, a) => s + (a.analysis?.impact_score ?? 0), 0) / total).toFixed(1)
    : '--'

  if (loading || !signal) {
    return (
      <div className="flex items-center justify-center h-full">
        <span className="text-[11px] font-mono" style={{ color: 'var(--t3)' }}>Loading signals...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {predictions.length > 0 && (
        <PredictionStrip
          predictions={predictions}
          selected={selectedTF}
          onSelect={setSelectedTF}
          currentPrice={price.price}
        />
      )}

      <div
        className="flex flex-shrink-0 px-3"
        style={{ borderBottom: '1px solid var(--bdr)', background: 'var(--bg1)' }}
      >
        <div
          className="px-[14px] h-[38px] flex items-center text-[12px] font-semibold border-b-2"
          style={{ borderBottomColor: 'var(--gold)', color: 'var(--t1)' }}
        >
          Signals
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2.5">
        <div className="grid grid-cols-3 gap-2">
          <StatCard label="Daily Bias" accentColor="var(--bull)">
            <div className="flex items-center gap-2 mb-1">
              <BiasBadge bias={signal.bias} />
            </div>
            <StrengthBars value={signal.strength} />
            <p className="text-[11px] text-t2 mt-1.5 leading-[1.5]">{signal.executive_summary}</p>
            <p className="text-[9px] text-t3 mt-1.5">Based on {total} analyzed articles</p>
          </StatCard>

          <StatCard label="Gold Price" accentColor="var(--gold)">
            <div className="font-mono text-[28px] font-medium leading-none mb-1" style={{ color: 'var(--gold)' }}>
              ${formatPrice(price.price, 0)}
            </div>
            <div
              className="font-mono text-[11px] mb-1"
              style={{ color: price.change >= 0 ? 'var(--bull)' : 'var(--bear)' }}
            >
              {price.change >= 0 ? '▲' : '▼'} ${formatPrice(Math.abs(price.change))} ({price.change_pct >= 0 ? '+' : ''}{price.change_pct.toFixed(2)}%)
            </div>
            <p className="text-[11px] text-t2 leading-[1.5]">
              Day low: ${formatPrice(price.day_low, 0)} · High: ${formatPrice(price.day_high, 0)}
            </p>
          </StatCard>

          <StatCard label="News Sentiment" accentColor="var(--blue)">
            <div className="font-mono text-[28px] font-medium leading-none mb-1"
              style={{ color: bullPct >= 60 ? 'var(--bull)' : bullPct >= 40 ? 'var(--t1)' : 'var(--bear)' }}
            >
              {total > 0 ? `${bullPct}%` : '--'}
            </div>
            <div className="font-mono text-[11px] mb-1"
              style={{ color: bullPct >= 60 ? 'var(--bull)' : bullPct >= 40 ? 'var(--t1)' : 'var(--bear)' }}
            >
              {bullPct >= 60 ? 'Bullish' : bullPct >= 40 ? 'Neutral' : 'Bearish'} · Avg impact {avgImpact}/10
            </div>
            <p className="text-[11px] text-t2 leading-[1.5]">
              {bullish} bullish · {neutral} neutral · {bearish} bearish
            </p>
          </StatCard>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <ZonePanel side="buy"  zones={signal.buy_zones} />
          <ZonePanel side="sell" zones={signal.sell_zones} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <WeeklyOutlook outlook={signal.weekly_outlook} keyEvents={KEY_EVENTS} />
          <RiskFactors supporting={signal.supporting_factors} risks={signal.risk_factors} />
        </div>

        <EconomicCalendar events={events} />
      </div>
    </div>
  )
}
