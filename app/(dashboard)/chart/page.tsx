'use client'

import { useState } from 'react'
import Script from 'next/script'
import GoldChart from '@/components/chart/GoldChart'
import ChartControls from '@/components/chart/ChartControls'
import NewsTimeline from '@/components/chart/NewsTimeline'
import { usePriceStream } from '@/lib/hooks/use-price-stream'
import type { TimeFrame, NewsPin } from '@/lib/types'

const DEFAULT_PRICE = {
  price: 0, bid: 0, ask: 0, change: 0, change_pct: 0,
  day_low: 0, day_high: 0, source: 'yahoo' as const, live: false, ts: '',
}

const EMPTY_PINS: NewsPin[] = []

export default function ChartPage() {
  const price = usePriceStream(DEFAULT_PRICE)
  const [tf, setTf]           = useState<TimeFrame>('1D')
  const [selectedPin, setSelectedPin] = useState<string | null>(null)
  const [layers, setLayers]   = useState({ signals: true, news: true, volume: true })
  const [scriptReady, setScriptReady] = useState(false)

  const toggleLayer = (key: keyof typeof layers) =>
    setLayers((l) => ({ ...l, [key]: !l[key] }))

  return (
    <>
      {/* Load Lightweight Charts v4 via CDN */}
      <Script
        src="https://unpkg.com/lightweight-charts@4.1.0/dist/lightweight-charts.standalone.production.js"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />

      <div className="flex flex-col h-full overflow-hidden">
        {/* Tab bar */}
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
          {price.price > 0 && (
            <div className="ml-auto flex items-center gap-1 pr-2">
              <span
                className="font-mono text-[13px] font-semibold"
                style={{ color: 'var(--gold)' }}
              >
                ${price.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span
                className="font-mono text-[10px]"
                style={{ color: price.change >= 0 ? 'var(--bull)' : 'var(--bear)' }}
              >
                {price.change >= 0 ? '▲' : '▼'} {price.change_pct.toFixed(2)}%
              </span>
              <span className="text-[9px] font-mono" style={{ color: 'var(--t3)' }}>LIVE</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <ChartControls
          tf={tf}
          onTf={setTf}
          layers={layers}
          onLayer={toggleLayer}
          currentPrice={price.price}
        />

        {/* Chart — gated on LC script load */}
        {scriptReady ? (
          <GoldChart
            tf={tf}
            layers={layers}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <span className="text-[11px] font-mono" style={{ color: 'var(--t3)' }}>
              Loading chart library…
            </span>
          </div>
        )}

        {/* News timeline strip */}
        <NewsTimeline
          pins={EMPTY_PINS}
          highlightedId={selectedPin}
          onSelect={(id) => setSelectedPin(selectedPin === id ? null : id)}
        />
      </div>
    </>
  )
}
