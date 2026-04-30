'use client'

import { useEffect, useRef } from 'react'
import type { Candle, NewsPin, ZoneLevel } from '@/lib/types'

// Lightweight Charts v4 types — declared for shape reference, accessed via window at runtime
type LightweightChartsLib = {
  createChart: (el: HTMLElement, opts: object) => LWChart
  CrosshairMode: { Normal: number }
  LineStyle: { Dashed: number }
}

interface LWSeries {
  setData: (data: unknown[]) => void
  setMarkers: (markers: unknown[]) => void
}

interface LWChart {
  addCandlestickSeries: (opts: object) => LWSeries
  addHistogramSeries: (opts: object) => LWSeries
  addLineSeries: (opts: object) => LWSeries
  timeScale: () => { fitContent: () => void }
  applyOptions: (opts: object) => void
  remove: () => void
}

interface Props {
  candles: Candle[]
  pins: NewsPin[]
  buyZones: ZoneLevel[]
  sellZones: ZoneLevel[]
  layers: { signals: boolean; news: boolean; volume: boolean }
  selectedPinId: string | null
  onPinClick: (id: string) => void
}

export default function GoldChart({ candles, pins, buyZones, sellZones, layers }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef     = useRef<LWChart | null>(null)

  useEffect(() => {
    if (!containerRef.current || chartRef.current) return
    if (typeof window === 'undefined' || !(window as unknown as Record<string, unknown>).LightweightCharts) return

    const LC = (window as unknown as { LightweightCharts: LightweightChartsLib }).LightweightCharts
    const chart = LC.createChart(containerRef.current, {
      layout:    { background: { color: '#09090B' }, textColor: '#7B8096' },
      grid:      { vertLines: { color: '#1E2235' }, horzLines: { color: '#1E2235' } },
      crosshair: { mode: LC.CrosshairMode.Normal },
      rightPriceScale: { borderColor: '#1E2235' },
      timeScale:       { borderColor: '#1E2235', timeVisible: true },
      handleScroll: true,
      handleScale:  true,
    })
    chartRef.current = chart

    // Candlestick series
    const series = chart.addCandlestickSeries({
      upColor:         '#22C55E',
      downColor:       '#EF4444',
      borderUpColor:   '#22C55E',
      borderDownColor: '#EF4444',
      wickUpColor:     '#15803D',
      wickDownColor:   '#991B1B',
    })
    if (!candles.length) {
      chart.timeScale().fitContent()
      return () => { ro.disconnect(); chart.remove(); chartRef.current = null }
    }
    series.setData(candles)

    // Volume
    if (layers.volume) {
      const volSeries = chart.addHistogramSeries({
        color: '#22C55E',
        priceFormat: { type: 'volume' },
        priceScaleId: 'volume',
        scaleMargins: { top: 0.8, bottom: 0 },
      })
      volSeries.setData(candles.map((c) => ({
        time: c.time,
        value: c.volume,
        color: c.close >= c.open ? 'rgba(34,197,94,.25)' : 'rgba(239,68,68,.25)',
      })))
    }

    // Signal zone lines
    if (layers.signals) {
      buyZones.forEach((z) => {
        const line = chart.addLineSeries({
          color: 'rgba(34,197,94,.5)',
          lineWidth: 1,
          lineStyle: LC.LineStyle.Dashed,
          lastValueVisible: false,
          priceLineVisible: false,
        })
        line.setData(candles.map((c) => ({ time: c.time, value: z.price })))
      })
      sellZones.forEach((z) => {
        const line = chart.addLineSeries({
          color: 'rgba(239,68,68,.5)',
          lineWidth: 1,
          lineStyle: LC.LineStyle.Dashed,
          lastValueVisible: false,
          priceLineVisible: false,
        })
        line.setData(candles.map((c) => ({ time: c.time, value: z.price })))
      })
    }

    // News markers
    if (layers.news && pins.length > 0) {
      const last = candles[candles.length - 1]
      if (!last) return
      const recent = candles.slice(-pins.length)
      const markers = pins.map((n, i) => ({
        time:     recent[i]?.time ?? last.time,
        position: 'aboveBar',
        color:    n.impact === 'HIGH' ? '#EF4444' : n.impact === 'MEDIUM' ? '#F59E0B' : '#3B82F6',
        shape:    'circle',
        text:     String(i + 1),
        size:     1,
      }))
      series.setMarkers(markers)
    }

    // Resize observer
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        chart.applyOptions({ width, height })
      }
    })
    ro.observe(containerRef.current)
    chart.timeScale().fitContent()

    return () => {
      ro.disconnect()
      chart.remove()
      chartRef.current = null
    }
  }, [candles, pins, buyZones, sellZones, layers])

  return (
    <div className="flex-1 relative min-h-0">
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
      {/* Legend */}
      <div className="absolute top-2 right-3 flex gap-2.5 z-10 pointer-events-none">
        <div className="flex items-center gap-1">
          <div style={{ width: 16, borderTop: '2px dashed rgba(34,197,94,.6)' }} />
          <span className="text-[9px] text-t3">BUY ZONE</span>
        </div>
        <div className="flex items-center gap-1">
          <div style={{ width: 16, borderTop: '2px dashed rgba(239,68,68,.6)' }} />
          <span className="text-[9px] text-t3">SELL ZONE</span>
        </div>
      </div>
    </div>
  )
}
