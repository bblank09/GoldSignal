import Link from 'next/link'
import type { DailySignal } from '@/lib/types'
import { formatPrice } from '@/lib/format'

interface Props { signal: DailySignal }

export default function QuickSignal({ signal }: Props) {
  const buy  = signal.buy_zones[0]
  const sell = signal.sell_zones[0]

  return (
    <div className="border-b border-bdr px-3 py-2.5">
      <div className="text-[9px] tracking-[0.14em] uppercase text-t3 mb-[7px] font-semibold">Key Levels</div>

      {buy && (
        <div
          className="flex items-center justify-between px-[7px] py-[5px] rounded-[3px] mb-1 border"
          style={{ background: 'var(--bullbg)', borderColor: 'var(--bull2)' }}
        >
          <span className="text-[9px] font-bold tracking-[0.08em]" style={{ color: 'var(--bull)' }}>▲ BUY</span>
          <span className="font-mono text-[11px] font-semibold" style={{ color: 'var(--bull)' }}>
            ${formatPrice(buy.price, 0)}–${formatPrice(signal.buy_zones[1]?.price ?? buy.price, 0)}
          </span>
          <span className="font-mono text-[9px]" style={{ color: 'var(--amb)' }}>{Math.round(buy.confidence * 100)}%</span>
        </div>
      )}

      {sell && (
        <div
          className="flex items-center justify-between px-[7px] py-[5px] rounded-[3px] mb-1 border"
          style={{ background: 'var(--bearbg)', borderColor: 'var(--bear2)' }}
        >
          <span className="text-[9px] font-bold tracking-[0.08em]" style={{ color: 'var(--bear)' }}>▼ SELL</span>
          <span className="font-mono text-[11px] font-semibold" style={{ color: 'var(--bear)' }}>
            ${formatPrice(sell.price, 0)}–${formatPrice(signal.sell_zones[1]?.price ?? sell.price, 0)}
          </span>
          <span className="font-mono text-[9px]" style={{ color: 'var(--amb)' }}>{Math.round(sell.confidence * 100)}%</span>
        </div>
      )}

      <Link href="/signals" className="text-[10px] mt-1 block" style={{ color: 'var(--blue)' }}>
        Full signals →
      </Link>
    </div>
  )
}
