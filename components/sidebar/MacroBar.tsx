import type { MacroSnapshot } from '@/lib/types'

interface Props { macro: MacroSnapshot }

type MacroKey = keyof Omit<MacroSnapshot, 'ts'>

const ROWS: { key: MacroKey; label: string }[] = [
  { key: 'dxy',     label: 'DXY' },
  { key: 'us10y',   label: 'US10Y' },
  { key: 'us2y',    label: 'US2Y' },
  { key: 'vix',     label: 'VIX' },
  { key: 'sp500',   label: 'SPX' },
  { key: 'oil_wti', label: 'WTI' },
]

function macroColor(gold_impact: string): string {
  if (gold_impact === 'bull') return 'var(--bull)'
  if (gold_impact === 'bear') return 'var(--bear)'
  return 'var(--t2)'
}

export default function MacroBar({ macro }: Props) {
  return (
    <div className="border-b border-bdr px-3 py-2.5">
      <div className="text-[9px] tracking-[0.14em] uppercase text-t3 mb-[7px] font-semibold">Macro</div>
      {ROWS.map(({ key, label }) => {
        const row = macro[key]
        const isUp = row.direction === 'up'
        const col = macroColor(row.gold_impact)
        return (
          <div key={key} className="flex items-center py-[3px] border-b border-bdr last:border-b-0">
            <div className="text-[10px] text-t2 w-[48px]">{label}</div>
            <div className="font-mono text-[11px] flex-1">{row.value}</div>
            <div className="font-mono text-[10px]" style={{ color: col }}>
              {isUp ? '▲' : '▼'} {row.change >= 0 ? '+' : ''}{row.change}
            </div>
          </div>
        )
      })}
    </div>
  )
}
