'use client'

import type { NewsPin } from '@/lib/types'

interface Props {
  pins: NewsPin[]
  highlightedId: string | null
  onSelect: (id: string) => void
}

export default function NewsTimeline({ pins, highlightedId, onSelect }: Props) {
  return (
    <div
      className="flex-shrink-0 flex items-stretch overflow-x-auto"
      style={{ height: 90, borderTop: '1px solid var(--bdr)', background: 'var(--bg1)' }}
    >
      {pins.map((pin, idx) => {
        const isHighlighted = highlightedId === pin.id
        const pinColor = pin.impact === 'HIGH' ? '#EF4444' : pin.impact === 'MEDIUM' ? '#F59E0B' : '#3B82F6'
        const impBg    = pin.impact === 'HIGH' ? '#7F1D1D' : pin.impact === 'MEDIUM' ? '#78350F' : '#1E3A5F'
        const impText  = pin.impact === 'HIGH' ? '#FCA5A5' : pin.impact === 'MEDIUM' ? '#FDE68A' : '#93C5FD'

        return (
          <div
            key={pin.id}
            onClick={() => onSelect(pin.id)}
            className="flex-shrink-0 border-r border-bdr px-[10px] py-2 cursor-pointer transition-colors flex flex-col justify-between relative"
            style={{
              width: 180,
              background: isHighlighted ? 'var(--bg3)' : undefined,
              borderBottom: isHighlighted ? '2px solid var(--gold)' : '2px solid transparent',
            }}
          >
            {/* Pin number */}
            <div
              className="absolute top-[6px] right-2 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-bold border"
              style={{ borderColor: pinColor, color: pinColor, background: 'var(--bg1)' }}
            >
              {idx + 1}
            </div>

            <div className="font-mono text-[9px] text-t3 mb-[3px]">{pin.time}</div>
            <div
              className="text-[10px] text-t1 leading-[1.35] flex-1 overflow-hidden"
              style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' } as React.CSSProperties}
            >
              {pin.title}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span
                className="text-[8px] font-bold px-[4px] py-[1px] rounded-[2px]"
                style={{ background: impBg, color: impText }}
              >
                {pin.impact}
              </span>
              <span className="text-[9px] font-bold" style={{ color: 'var(--bull)' }}>▲</span>
              <span className="font-mono text-[9px] ml-auto" style={{ color: 'var(--bull)' }}>{pin.price_effect}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
