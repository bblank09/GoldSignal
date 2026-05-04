'use client'

import type { Prediction, PredictionTF } from '@/lib/types'
import { formatNumber } from '@/lib/format'

interface Props {
  predictions: Prediction[]
  selected: PredictionTF
  onSelect: (tf: PredictionTF) => void
  currentPrice: number
}

export default function PredictionStrip({ predictions, selected, onSelect, currentPrice }: Props) {
  return (
    <div
      className="flex overflow-x-auto flex-shrink-0"
      style={{ background: 'var(--bg1)', borderBottom: '1px solid var(--bdr)', paddingLeft: 0 }}
    >
      {predictions.map((p) => {
        const isSelected = selected === p.tf
        const isBull = p.bias === 'Bullish'
        const col = isBull ? 'var(--bull)' : 'var(--bear)'
        const chg = p.price - currentPrice

        return (
          <div
            key={p.tf}
            onClick={() => onSelect(p.tf)}
            className="flex-1 min-w-[120px] px-3 py-2 border-r border-bdr cursor-pointer transition-colors relative"
            style={{
              background: isSelected ? 'var(--bg3)' : undefined,
              borderBottom: isSelected ? '2px solid var(--gold)' : '2px solid transparent',
            }}
          >
            <div className="text-[9px] text-t3 uppercase tracking-[0.1em] mb-1 font-semibold">
              {p.tf} · {p.label}
            </div>
            <div className="font-mono text-[14px] font-semibold leading-none mb-[3px]" style={{ color: col }}>
              ${formatNumber(p.price)}
            </div>
            <div className="font-mono text-[10px] mb-1" style={{ color: col }}>
              {chg >= 0 ? '+' : ''}{chg.toFixed(0)} ({p.change_pct >= 0 ? '+' : ''}{p.change_pct.toFixed(1)}%)
            </div>
            <div className="h-[2px] bg-bg3 rounded-[1px] overflow-hidden mb-[3px]">
              <div className="h-full rounded-[1px]" style={{ width: `${p.confidence * 100}%`, background: col }} />
            </div>
            <div className="text-[9px] font-bold tracking-[0.07em]" style={{ color: col }}>
              {isBull ? '▲' : '▼'} {p.bias.toUpperCase()}
            </div>
            <div className="text-[9px] text-t3 font-mono mt-[2px]">
              B:{formatNumber(p.bull_price)} / Bs:{formatNumber(p.base_price)} / Br:{formatNumber(p.bear_price)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
