'use client'

import type { TimeFrame } from '@/lib/types'
import { formatNumber } from '@/lib/format'

const TF_OPTIONS: TimeFrame[] = ['15m', '1H', '4H', '1D', '1W']

interface LayerState {
  signals: boolean
  news: boolean
  volume: boolean
}

interface Props {
  tf: TimeFrame
  onTf: (tf: TimeFrame) => void
  layers: LayerState
  onLayer: (key: keyof LayerState) => void
  currentPrice: number
}

export default function ChartControls({ tf, onTf, layers, onLayer, currentPrice }: Props) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-[7px] flex-shrink-0"
      style={{ borderBottom: '1px solid var(--bdr)', background: 'var(--bg2)' }}
    >
      <span className="text-[9px] text-t3 mr-1 uppercase tracking-[0.08em]">Timeframe</span>
      {TF_OPTIONS.map((t) => (
        <button
          key={t}
          onClick={() => onTf(t)}
          className="px-[9px] py-[3px] rounded-[2px] font-mono text-[10px] font-semibold border cursor-pointer transition-colors"
          style={{
            borderColor: tf === t ? 'var(--gold)' : 'var(--bdr2)',
            background: tf === t ? 'var(--ambbg)' : 'var(--bg3)',
            color: tf === t ? 'var(--gold)' : 'var(--t2)',
          }}
        >
          {t}
        </button>
      ))}

      <div className="w-px h-4 bg-bdr2 mx-1.5" />
      <span className="text-[9px] text-t3 mr-1 uppercase tracking-[0.08em]">Layers</span>

      {(['signals', 'news', 'volume'] as const).map((key) => (
        <button
          key={key}
          onClick={() => onLayer(key)}
          className="px-[9px] py-[3px] rounded-[2px] font-mono text-[10px] border cursor-pointer transition-colors capitalize"
          style={{
            borderColor: layers[key] ? 'var(--bull2)' : 'var(--bdr2)',
            background: layers[key] ? 'var(--bullbg)' : 'var(--bg3)',
            color: layers[key] ? 'var(--bull)' : 'var(--t2)',
          }}
        >
          {key === 'signals' ? 'Signal Zones' : key === 'news' ? 'News Pins' : 'Volume'}
        </button>
      ))}

      <div className="ml-auto text-[10px] text-t2">
        <span className="text-t3">Last: </span>
        <span className="font-mono" style={{ color: 'var(--gold)' }}>${formatNumber(currentPrice, 2)}</span>
      </div>
    </div>
  )
}
