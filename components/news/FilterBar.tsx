'use client'

import type { NewsFilter } from '@/lib/types'
import { useUIStore } from '@/lib/store/ui-store'

const CHIPS: { value: NewsFilter; label: string; style?: string }[] = [
  { value: 'all',     label: 'All' },
  { value: 'high',    label: '● High Impact', style: 'high' },
  { value: 'bullish', label: '▲ Bullish',     style: 'bull' },
  { value: 'bearish', label: '▼ Bearish',     style: 'bear' },
  { value: 'neutral', label: '◆ Neutral' },
]

export default function FilterBar() {
  const { activeFilter, setActiveFilter } = useUIStore()

  return (
    <div
      className="flex items-center gap-[5px] px-3 py-2 flex-shrink-0"
      style={{ borderBottom: '1px solid var(--bdr)', background: 'var(--bg2)' }}
    >
      {CHIPS.map(({ value, label, style }) => {
        const isActive = activeFilter === value
        const base = 'px-[9px] py-[3px] rounded-[2px] text-[10px] font-medium cursor-pointer border transition-all select-none whitespace-nowrap'
        let chipStyle: React.CSSProperties = {
          border: `1px solid ${isActive ? 'var(--t1)' : 'var(--bdr2)'}`,
          background: isActive ? 'var(--bg4)' : 'var(--bg3)',
          color: isActive ? 'var(--t1)' : 'var(--t2)',
          fontWeight: isActive ? 600 : 500,
        }
        if (style === 'high') {
          chipStyle = {
            border: `1px solid ${isActive ? 'var(--bear2)' : 'var(--bear2)'}`,
            background: isActive ? 'var(--bearbg)' : 'var(--bg3)',
            color: 'var(--bear)',
          }
        } else if (style === 'bull') {
          chipStyle = {
            border: `1px solid var(--bull2)`,
            background: isActive ? 'var(--bullbg)' : 'var(--bg3)',
            color: 'var(--bull)',
          }
        } else if (style === 'bear') {
          chipStyle = {
            border: `1px solid var(--bear2)`,
            background: isActive ? 'var(--bearbg)' : 'var(--bg3)',
            color: 'var(--bear)',
          }
        }
        return (
          <button key={value} className={base} style={chipStyle} onClick={() => setActiveFilter(value)}>
            {label}
          </button>
        )
      })}
    </div>
  )
}
