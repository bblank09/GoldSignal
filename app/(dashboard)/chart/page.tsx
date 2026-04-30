'use client'

import { useState, useEffect, useMemo } from 'react'
import TradingViewChart from '@/components/chart/TradingViewChart'
import PredictionStrip from '@/components/signals/PredictionStrip'
import ChartControls from '@/components/chart/ChartControls'
import NewsTimeline from '@/components/chart/NewsTimeline'
import { usePriceStream } from '@/lib/hooks/use-price-stream'
import { buildPredictionsFromSignal } from '@/lib/build-predictions'
import type { TimeFrame, PredictionTF, DailySignal, NewsPin, ArticleWithAnalysis } from '@/lib/types'

const DEFAULT_PRICE = { price: 0, bid: 0, ask: 0, change: 0, change_pct: 0, day_low: 0, day_high: 0, source: 'yahoo' as const, live: false, ts: '' }

function articlesToPins(articles: ArticleWithAnalysis[]): NewsPin[] {
  return articles
    .filter((a) => a.analysis)
    .slice(0, 20)
    .map((a) => ({
      id:           a.id,
      article_id:   a.id,
      time:         a.published_at.split('T')[0],
      ts:           new Date(a.published_at).getTime(),
      title:        a.title,
      impact:       a.analysis.impact_level,
      sentiment:    a.analysis.sentiment,
      price_effect: a.analysis.expected_move ?? '',
    }))
}

const TV_TF_MAP: Record<string, string> = {
  '1H': '60', '4H': '240', '1D': 'D', '1W': 'W', '1M': 'M',
}

export default function ChartPage() {
  const price = usePriceStream(DEFAULT_PRICE)
  const [tf, setTf]  = useState<TimeFrame>('1D')
  const [selectedPin, setSelectedPin]       = useState<string | null>(null)
  const [selectedPredTF, setSelectedPredTF] = useState<PredictionTF>('1D')
  const [layers, setLayers] = useState({ signals: true, news: true, volume: true })
  const [signal, setSignal] = useState<DailySignal | null>(null)
  const [pins, setPins]     = useState<NewsPin[]>([])

  const toggleLayer = (key: keyof typeof layers) =>
    setLayers((l) => ({ ...l, [key]: !l[key] }))

  useEffect(() => {
    fetch('/api/signal/daily')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setSignal(d) })
      .catch(() => {})

    fetch('/api/news?limit=30')
      .then((r) => r.ok ? r.json() : null)
      .then((d: ArticleWithAnalysis[] | null) => { if (d) setPins(articlesToPins(d)) })
      .catch(() => {})
  }, [])

  const predictions = useMemo(() => {
    if (!signal || !price.price) return []
    return buildPredictionsFromSignal(signal, price.price)
  }, [signal, price.price])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {predictions.length > 0 && (
        <PredictionStrip
          predictions={predictions}
          selected={selectedPredTF}
          onSelect={setSelectedPredTF}
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
          Chart — XAU/USD
        </div>
      </div>

      <ChartControls
        tf={tf}
        onTf={setTf}
        layers={layers}
        onLayer={toggleLayer}
        currentPrice={price.price}
      />

      <TradingViewChart
        buyZones={layers.signals && signal ? signal.buy_zones : []}
        sellZones={layers.signals && signal ? signal.sell_zones : []}
        timeframe={TV_TF_MAP[tf] ?? 'D'}
      />

      {pins.length > 0 && (
        <NewsTimeline
          pins={pins}
          highlightedId={selectedPin}
          onSelect={(id) => setSelectedPin(selectedPin === id ? null : id)}
        />
      )}
    </div>
  )
}
