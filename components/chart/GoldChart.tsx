'use client'

import { useEffect, useRef, useState } from 'react'
import type { Candle, ZoneLevel, ArticleWithAnalysis, DailySignal } from '@/lib/types'

// ─── Lightweight Charts v4 types (accessed via window — no ESM import) ─────────
type LCLineStyle = { Dashed: number; Solid: number }
type LCCrosshairMode = { Normal: number }

type LWSeries = {
  setData: (data: unknown[]) => void
  setMarkers: (markers: unknown[]) => void
}

type LWChart = {
  addCandlestickSeries: (opts: object) => LWSeries
  addHistogramSeries:   (opts: object) => LWSeries
  addLineSeries:        (opts: object) => LWSeries
  timeScale:            () => { fitContent: () => void }
  applyOptions:         (opts: object) => void
  remove:               () => void
}

type LCLib = {
  createChart:    (el: HTMLElement, opts: object) => LWChart
  CrosshairMode:  LCCrosshairMode
  LineStyle:      LCLineStyle
}

function getLC(): LCLib | null {
  if (typeof window === 'undefined') return null
  return (window as unknown as { LightweightCharts?: LCLib }).LightweightCharts ?? null
}

// ─── TF → Yahoo interval/range ──────────────────────────────────────────────────
const TF_PARAMS: Record<string, { interval: string; range: string }> = {
  '15m': { interval: '15m', range: '1d'  },
  '1H':  { interval: '60m', range: '5d'  },
  '4H':  { interval: '60m', range: '14d' },
  '1D':  { interval: '1d',  range: '6mo' },
  '1W':  { interval: '1d',  range: '2y'  },
}

// ─── Aggregate 1H into 4H client-side ──────────────────────────────────────────
function groupTo4H(candles: Candle[]): Candle[] {
  const groups: Record<string, Candle[]> = {}
  for (const c of candles) {
    const key = c.time.slice(0, 13).replace('T', ' ').slice(0, 10) + ' ' +
      String(Math.floor(parseInt(c.time.slice(11, 13) || '0') / 4) * 4).padStart(2, '0')
    if (!groups[key]) groups[key] = []
    groups[key].push(c)
  }
  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([time, cs]) => ({
      time,
      open:   cs[0].open,
      high:   Math.max(...cs.map((c) => c.high)),
      low:    Math.min(...cs.map((c) => c.low)),
      close:  cs[cs.length - 1].close,
      volume: cs.reduce((s, c) => s + c.volume, 0),
    }))
}

// ─── Merge support/resistance from top articles ─────────────────────────────────
function extractLevels(articles: ArticleWithAnalysis[]): {
  support: { price: number; title: string }[]
  resistance: { price: number; title: string }[]
} {
  const sorted = [...articles]
    .filter((a) => a.analysis?.key_levels)
    .sort((a, b) => b.analysis.impact_score - a.analysis.impact_score)
    .slice(0, 20)

  const support:    { price: number; title: string }[] = []
  const resistance: { price: number; title: string }[] = []

  for (const a of sorted) {
    const kl = a.analysis.key_levels
    for (const p of kl.support)    support.push({ price: p, title: a.title })
    for (const p of kl.resistance) resistance.push({ price: p, title: a.title })
  }

  // Deduplicate within ±5 tolerance — keep highest-confidence
  const dedup = (levels: { price: number; title: string }[]) => {
    const out: { price: number; title: string }[] = []
    for (const l of levels) {
      if (!out.some((x) => Math.abs(x.price - l.price) < 5)) out.push(l)
    }
    return out
  }

  return { support: dedup(support), resistance: dedup(resistance) }
}

// ─── Props ───────────────────────────────────────────────────────────────────────
interface Props {
  tf: string
  layers: { signals: boolean; news: boolean; volume: boolean }
  buyZones?:  ZoneLevel[]
  sellZones?: ZoneLevel[]
}

export default function GoldChart({ tf, layers, buyZones = [], sellZones = [] }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef     = useRef<LWChart | null>(null)

  const [candles,  setCandles]  = useState<Candle[]>([])
  const [articles, setArticles] = useState<ArticleWithAnalysis[]>([])
  const [signal,   setSignal]   = useState<DailySignal | null>(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)

  // ── Fetch data whenever TF changes ───────────────────────────────────────────
  useEffect(() => {
    setLoading(true)
    setError(null)

    const params = TF_PARAMS[tf] ?? TF_PARAMS['1D']

    Promise.allSettled([
      fetch(`/api/chart/candles?interval=${params.interval}`).then((r) => r.ok ? r.json() as Promise<Candle[]> : Promise.reject(`HTTP ${r.status}`)),
      fetch('/api/news?limit=100').then((r) => r.ok ? r.json() as Promise<ArticleWithAnalysis[]> : Promise.reject()),
      fetch('/api/signal/daily').then((r) => r.ok ? r.json() as Promise<DailySignal> : Promise.reject()),
    ]).then(([candleRes, newsRes, sigRes]) => {
      let raw: Candle[] = []
      if (candleRes.status === 'fulfilled') raw = candleRes.value
      if (tf === '4H') raw = groupTo4H(raw)

      if (newsRes.status  === 'fulfilled') setArticles(newsRes.value)
      if (sigRes.status   === 'fulfilled') setSignal(sigRes.value)

      if (raw.length === 0) setError('No candle data returned from Yahoo Finance')
      setCandles(raw)
      setLoading(false)
    })
  }, [tf])

  // ── Build / rebuild chart whenever data or layers change ──────────────────────
  useEffect(() => {
    const LC = getLC()
    if (!LC || !containerRef.current) return
    if (loading) return

    // Destroy previous chart instance
    if (chartRef.current) {
      chartRef.current.remove()
      chartRef.current = null
    }

    const chart = LC.createChart(containerRef.current, {
      layout:    { background: { color: '#09090B' }, textColor: '#7B8096' },
      grid:      { vertLines: { color: '#1E2235' }, horzLines: { color: '#1E2235' } },
      crosshair: { mode: LC.CrosshairMode.Normal },
      rightPriceScale: { borderColor: '#1E2235' },
      timeScale:       { borderColor: '#1E2235', timeVisible: true, secondsVisible: false },
      handleScroll: true,
      handleScale:  true,
    })
    chartRef.current = chart

    // ── Candlestick ────────────────────────────────────────────────────────────
    const candleSeries = chart.addCandlestickSeries({
      upColor:         '#22C55E',
      downColor:       '#EF4444',
      borderUpColor:   '#22C55E',
      borderDownColor: '#EF4444',
      wickUpColor:     '#15803D',
      wickDownColor:   '#991B1B',
    })
    if (candles.length > 0) {
      candleSeries.setData(candles)
    }

    // ── Volume histogram ───────────────────────────────────────────────────────
    if (layers.volume && candles.length > 0) {
      const volSeries = chart.addHistogramSeries({
        priceFormat:  { type: 'volume' },
        priceScaleId: 'volume',
        scaleMargins: { top: 0.85, bottom: 0 },
      })
      volSeries.setData(candles.map((c) => ({
        time:  c.time,
        value: c.volume,
        color: c.close >= c.open ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)',
      })))
    }

    // ── AI-derived support / resistance lines ───────────────────────────────────
    if (layers.signals && candles.length > 0) {
      const { support, resistance } = extractLevels(articles)

      // Use real buy/sell zones from daily signal (or fallback to prop)
      const buys  = signal?.buy_zones  ?? buyZones
      const sells = signal?.sell_zones ?? sellZones

      // Support lines (from analyzed articles)
      for (const lvl of support) {
        const s = chart.addLineSeries({
          color:            'rgba(34,197,94,0.45)',
          lineWidth:        1,
          lineStyle:        LC.LineStyle.Dashed,
          lastValueVisible: true,
          priceLineVisible: false,
          title:            `S $${lvl.price.toFixed(0)}`,
        })
        s.setData(candles.map((c) => ({ time: c.time, value: lvl.price })))
      }

      // Resistance lines (from analyzed articles)
      for (const lvl of resistance) {
        const s = chart.addLineSeries({
          color:            'rgba(239,68,68,0.45)',
          lineWidth:        1,
          lineStyle:        LC.LineStyle.Dashed,
          lastValueVisible: true,
          priceLineVisible: false,
          title:            `R $${lvl.price.toFixed(0)}`,
        })
        s.setData(candles.map((c) => ({ time: c.time, value: lvl.price })))
      }

      // Buy zone lines (bold, from daily signal)
      for (const z of buys) {
        const s = chart.addLineSeries({
          color:            'rgba(34,197,94,0.85)',
          lineWidth:        2,
          lineStyle:        LC.LineStyle.Solid,
          lastValueVisible: true,
          priceLineVisible: false,
          title:            `BUY $${z.price.toFixed(0)} · ${z.reason.slice(0, 28)}`,
        })
        s.setData(candles.map((c) => ({ time: c.time, value: z.price })))
      }

      // Sell zone lines (bold, from daily signal)
      for (const z of sells) {
        const s = chart.addLineSeries({
          color:            'rgba(239,68,68,0.85)',
          lineWidth:        2,
          lineStyle:        LC.LineStyle.Solid,
          lastValueVisible: true,
          priceLineVisible: false,
          title:            `SELL $${z.price.toFixed(0)} · ${z.reason.slice(0, 28)}`,
        })
        s.setData(candles.map((c) => ({ time: c.time, value: z.price })))
      }
    }

    // ── News markers on candlestick ─────────────────────────────────────────────
    if (layers.news && articles.length > 0 && candles.length > 0) {
      const candleTimeSet = new Set(candles.map((c) => c.time))
      const lastTime = candles[candles.length - 1].time

      const markers = articles
        .filter((a) => a.analysis)
        .slice(0, 50)
        .map((a) => {
          const day  = a.published_at.split('T')[0]
          const time = candleTimeSet.has(day) ? day : lastTime
          const sent = a.analysis.sentiment
          return {
            time,
            position: sent === 'Bearish' ? 'belowBar' : 'aboveBar',
            color:    sent === 'Bullish' ? '#22C55E' : sent === 'Bearish' ? '#EF4444' : '#F59E0B',
            shape:    sent === 'Bearish' ? 'arrowDown' : 'arrowUp',
            text:     a.title.slice(0, 30),
            size:     a.analysis.impact_level === 'HIGH' ? 1.5 : 1,
          }
        })
        // Sort by time ascending (required by Lightweight Charts)
        .sort((a, b) => String(a.time).localeCompare(String(b.time)))

      candleSeries.setMarkers(markers)
    }

    // ── Resize observer ─────────────────────────────────────────────────────────
    const el = containerRef.current
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (chartRef.current) chartRef.current.applyOptions({ width, height })
      }
    })
    ro.observe(el)
    chart.timeScale().fitContent()

    return () => {
      ro.disconnect()
      if (chartRef.current) {
        chartRef.current.remove()
        chartRef.current = null
      }
    }
  }, [candles, articles, signal, layers, buyZones, sellZones, loading])

  return (
    <div className="flex-1 relative min-h-0 flex flex-col">
      {/* Loading / error states */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <span className="text-[11px] font-mono" style={{ color: 'var(--t3)' }}>
            Loading OHLCV data from Yahoo Finance…
          </span>
        </div>
      )}
      {!loading && error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <span className="text-[11px] font-mono" style={{ color: 'var(--bear)' }}>{error}</span>
        </div>
      )}

      {/* Chart container */}
      <div ref={containerRef} style={{ width: '100%', flex: 1 }} />

      {/* Legend */}
      <div className="absolute top-2 right-3 flex flex-wrap gap-x-3 gap-y-1 z-10 pointer-events-none">
        {layers.signals && (
          <>
            <span className="flex items-center gap-1">
              <span style={{ display: 'inline-block', width: 14, borderTop: '2px solid rgba(34,197,94,0.85)' }} />
              <span className="text-[9px]" style={{ color: 'var(--t3)' }}>BUY ZONE</span>
            </span>
            <span className="flex items-center gap-1">
              <span style={{ display: 'inline-block', width: 14, borderTop: '2px solid rgba(239,68,68,0.85)' }} />
              <span className="text-[9px]" style={{ color: 'var(--t3)' }}>SELL ZONE</span>
            </span>
            <span className="flex items-center gap-1">
              <span style={{ display: 'inline-block', width: 14, borderTop: '1px dashed rgba(34,197,94,0.45)' }} />
              <span className="text-[9px]" style={{ color: 'var(--t3)' }}>AI Support</span>
            </span>
            <span className="flex items-center gap-1">
              <span style={{ display: 'inline-block', width: 14, borderTop: '1px dashed rgba(239,68,68,0.45)' }} />
              <span className="text-[9px]" style={{ color: 'var(--t3)' }}>AI Resistance</span>
            </span>
          </>
        )}
        {layers.news && (
          <>
            <span className="flex items-center gap-1">
              <span style={{ color: '#22C55E', fontSize: 10 }}>▲</span>
              <span className="text-[9px]" style={{ color: 'var(--t3)' }}>Bullish news</span>
            </span>
            <span className="flex items-center gap-1">
              <span style={{ color: '#EF4444', fontSize: 10 }}>▼</span>
              <span className="text-[9px]" style={{ color: 'var(--t3)' }}>Bearish news</span>
            </span>
          </>
        )}
      </div>
    </div>
  )
}
