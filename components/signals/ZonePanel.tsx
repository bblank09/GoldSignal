import type { ZoneLevel } from '@/lib/types'
import ZoneRow from './ZoneRow'

interface Props {
  side: 'buy' | 'sell'
  zones: ZoneLevel[]
}

export default function ZonePanel({ side, zones }: Props) {
  const isBuy = side === 'buy'
  return (
    <div
      className="rounded-[3px] overflow-hidden"
      style={{ background: 'var(--bg1)', border: '1px solid var(--bdr)' }}
    >
      <div
        className="flex items-center gap-2 px-3 py-2"
        style={{ borderBottom: '1px solid var(--bdr)' }}
      >
        <span
          className="text-[12px] font-bold tracking-[0.04em]"
          style={{ color: isBuy ? 'var(--bull)' : 'var(--bear)' }}
        >
          {isBuy ? '▲ BUY ZONES' : '▼ SELL ZONES'}
        </span>
      </div>
      <div className="px-3 py-2 flex flex-col gap-1.5">
        {zones.map((z, i) => (
          <ZoneRow key={i} zone={z} side={side} />
        ))}
      </div>
    </div>
  )
}
