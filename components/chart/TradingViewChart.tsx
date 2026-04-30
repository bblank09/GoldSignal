'use client'

import { useEffect, useRef } from 'react'

interface Props {
  buyZones?: { price: number; type: string; reason: string }[]
  sellZones?: { price: number; type: string; reason: string }[]
  timeframe?: string
}

export default function TradingViewChart({ buyZones = [], sellZones = [], timeframe = 'D' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<unknown>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Clean up previous widget
    if (containerRef.current.querySelector('iframe')) {
      containerRef.current.innerHTML = ''
    }

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.async = true
    script.onload = () => {
      if (!containerRef.current) return

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const TradingView = (window as any).TradingView
      if (!TradingView) return

      // Build studies array for buy/sell zones
      const studies: string[] = []

      widgetRef.current = new TradingView.widget({
        container_id: containerRef.current.id,
        autosize: true,
        symbol: 'OANDA:XAUUSD',
        interval: timeframe,
        timezone: 'Asia/Bangkok',
        theme: 'dark',
        style: '1', // candlestick
        locale: 'en',
        toolbar_bg: '#09090B',
        enable_publishing: false,
        hide_side_toolbar: false,
        allow_symbol_change: false,
        save_image: false,
        hide_volume: false,
        studies: [
          'MASimple@tv-basicstudies',       // SMA 50
          'MAExp@tv-basicstudies',          // EMA 200
          'RSI@tv-basicstudies',            // RSI
          'BB@tv-basicstudies',             // Bollinger Bands
          ...studies,
        ],
        studies_overrides: {
          'moving average.length': 50,
          'moving average.plot.color': '#F59E0B',
          'moving average exponential.length': 200,
          'moving average exponential.plot.color': '#8B5CF6',
        },
        overrides: {
          'paneProperties.background': '#09090B',
          'paneProperties.backgroundType': 'solid',
          'paneProperties.vertGridProperties.color': '#1E2235',
          'paneProperties.horzGridProperties.color': '#1E2235',
          'scalesProperties.textColor': '#7B8096',
          'scalesProperties.lineColor': '#1E2235',
          'mainSeriesProperties.candleStyle.upColor': '#22C55E',
          'mainSeriesProperties.candleStyle.downColor': '#EF4444',
          'mainSeriesProperties.candleStyle.wickUpColor': '#15803D',
          'mainSeriesProperties.candleStyle.wickDownColor': '#991B1B',
          'mainSeriesProperties.candleStyle.borderUpColor': '#22C55E',
          'mainSeriesProperties.candleStyle.borderDownColor': '#EF4444',
        },
        loading_screen: { backgroundColor: '#09090B', foregroundColor: '#D4A843' },
        custom_css_url: '',
      })

      // After widget is ready, add buy/sell zone horizontal lines
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const widget = widgetRef.current as any
      if (widget && widget.onChartReady) {
        widget.onChartReady(() => {
          const chart = widget.chart()

          // Draw buy zone lines (green dashed)
          buyZones.forEach((zone) => {
            chart.createShape(
              { price: zone.price },
              {
                shape: 'horizontal_line',
                overrides: {
                  linecolor: '#22C55E',
                  linestyle: 1, // dashed
                  linewidth: 1,
                  showLabel: true,
                  text: `BUY ${zone.type}: $${zone.price}`,
                  textcolor: '#22C55E',
                  fontsize: 10,
                  horzLabelsAlign: 'right',
                },
              }
            )
          })

          // Draw sell zone lines (red dashed)
          sellZones.forEach((zone) => {
            chart.createShape(
              { price: zone.price },
              {
                shape: 'horizontal_line',
                overrides: {
                  linecolor: '#EF4444',
                  linestyle: 1, // dashed
                  linewidth: 1,
                  showLabel: true,
                  text: `SELL ${zone.type}: $${zone.price}`,
                  textcolor: '#EF4444',
                  fontsize: 10,
                  horzLabelsAlign: 'right',
                },
              }
            )
          })
        })
      }
    }

    document.head.appendChild(script)

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script)
    }
  }, [buyZones, sellZones, timeframe])

  return (
    <div className="flex-1 relative min-h-0">
      <div
        id="tradingview-chart"
        ref={containerRef}
        style={{ width: '100%', height: '100%' }}
      />
      {/* Zone legend */}
      <div className="absolute top-2 right-3 flex flex-col gap-1 z-10 pointer-events-none">
        {buyZones.map((z) => (
          <div key={z.price} className="flex items-center gap-1.5 bg-bg0/80 backdrop-blur-sm px-2 py-1 rounded-[3px]">
            <div style={{ width: 12, borderTop: '2px dashed rgba(34,197,94,.7)' }} />
            <span className="text-[9px] font-mono" style={{ color: '#22C55E' }}>BUY ${z.price}</span>
          </div>
        ))}
        {sellZones.map((z) => (
          <div key={z.price} className="flex items-center gap-1.5 bg-bg0/80 backdrop-blur-sm px-2 py-1 rounded-[3px]">
            <div style={{ width: 12, borderTop: '2px dashed rgba(239,68,68,.7)' }} />
            <span className="text-[9px] font-mono" style={{ color: '#EF4444' }}>SELL ${z.price}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
