'use client'

import type { NewsCategory } from '@/lib/types'

interface Props {
  categories: NewsCategory[]
  activeId: string | null
  onSelect: (id: string | null) => void
}

const IMPACT_COLORS: Record<string, { text: string; bg: string }> = {
  HIGH:   { text: '#FCA5A5', bg: '#7F1D1D' },
  MEDIUM: { text: '#FDE68A', bg: '#78350F' },
  LOW:    { text: '#93C5FD', bg: '#1E3A5F' },
}

export default function NewsCategoryList({ categories, activeId, onSelect }: Props) {
  return (
    <div className="border-b border-bdr px-3 py-2.5">
      <div className="text-[9px] tracking-[0.14em] uppercase text-t3 mb-[7px] font-semibold">Categories</div>
      {categories.map((cat) => {
        const isActive = cat.id === activeId
        const ic = IMPACT_COLORS[cat.impact]
        return (
          <div
            key={cat.id}
            onClick={() => onSelect(isActive ? null : cat.id)}
            className={`flex items-center gap-2 px-2 py-[6px] rounded-[3px] cursor-pointer transition-colors mb-[2px] border ${
              isActive ? 'border-bdr2' : 'border-transparent hover:bg-bg2'
            }`}
            style={{ background: isActive ? 'var(--bg3)' : undefined }}
          >
            <div className="w-[6px] h-[6px] rounded-full flex-shrink-0" style={{ background: cat.color }} />
            <span className="text-[11px] font-medium text-t1 flex-1">{cat.name}</span>
            <span className="font-mono text-[10px] text-t3">{cat.count}</span>
            <span
              className="text-[9px] font-bold tracking-[0.06em] px-[5px] py-[1px] rounded-[2px]"
              style={{ background: ic.bg, color: ic.text }}
            >
              {cat.impact}
            </span>
          </div>
        )
      })}
    </div>
  )
}
