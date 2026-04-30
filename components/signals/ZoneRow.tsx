import type { ZoneLevel } from '@/lib/types'
import { formatPrice } from '@/lib/format'

interface Props {
  zone: ZoneLevel
  side: 'buy' | 'sell'
}

export default function ZoneRow({ zone, side }: Props) {
  const isBuy = side === 'buy'
  const col = isBuy ? 'var(--bull)' : 'var(--bear)'
  const bg  = isBuy ? 'var(--bullbg)' : 'var(--bearbg)'
  const bc  = isBuy ? 'var(--bull2)'  : 'var(--bear2)'

  const strongStyle = isBuy
    ? { background: 'var(--bull2)', color: '#D1FAE5' }
    : { background: 'var(--bear2)', color: '#FEE2E2' }
  const specStyle = isBuy
    ? { background: '#14532D', color: 'var(--bull)', border: '1px solid var(--bull2)' }
    : { background: '#450A0A', color: 'var(--bear)', border: '1px solid var(--bear2)' }

  return (
    <div className="rounded-[3px] px-[10px] py-2 border" style={{ background: bg, borderColor: bc }}>
      {/* Head */}
      <div className="flex items-center gap-2 mb-[5px]">
        <span className="font-mono text-[16px] font-semibold" style={{ color: col }}>
          ${formatPrice(zone.price, 0)}
        </span>
        <span
          className="text-[9px] font-bold px-[6px] py-[2px] rounded-[2px] tracking-[0.08em]"
          style={zone.type === 'Strong' ? strongStyle : specStyle}
        >
          {zone.type.toUpperCase()}
        </span>
      </div>

      {/* Confidence bar */}
      <div className="flex items-center gap-1.5 mb-1">
        <div className="flex-1 h-[3px] bg-bg3 rounded-[2px] overflow-hidden">
          <div className="h-full rounded-[2px]" style={{ width: `${zone.confidence * 100}%`, background: col }} />
        </div>
        <span className="font-mono text-[9px]" style={{ color: col }}>{Math.round(zone.confidence * 100)}%</span>
      </div>

      {/* Reason */}
      <p className="text-[10px] text-t2 leading-[1.4] mb-1">{zone.reason}</p>

      {/* SL / Target */}
      <div className="flex gap-3 text-[9px] text-t2">
        <span>Stop: <span className="font-mono text-[10px]">${formatPrice(zone.stop_loss, 0)}</span></span>
        <span>Target: <span className="font-mono text-[10px]">${formatPrice(zone.target, 0)}</span></span>
      </div>
    </div>
  )
}
