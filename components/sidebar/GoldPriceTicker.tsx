import type { GoldPrice } from '@/lib/types'
import { formatPrice } from '@/lib/format'
import { usePriceStream } from '@/lib/hooks/use-price-stream'

interface Props { price: GoldPrice }

export default function GoldPriceTicker({ price: initialPrice }: Props) {
  const price = usePriceStream(initialPrice)
  const rangePct = Math.max(0, Math.min(100, ((price.price - price.day_low) / (price.day_high - price.day_low)) * 100))
  const isUp = price.change >= 0

  return (
    <div className="border-b border-bdr px-3 py-2.5">
      <div className="text-[9px] tracking-[0.14em] uppercase text-t3 mb-[7px] font-semibold">XAU / USD</div>
      <div className="font-mono text-[26px] font-medium text-gold leading-none">
        {formatPrice(price.price)}
      </div>
      <div className="font-mono text-[10px] text-t2 mt-[3px]">
        ฿{(price.price * 1.06 * 0.97 * 31.1).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} / baht weight
      </div>
      <div className="font-mono text-[12px] mt-1" style={{ color: isUp ? 'var(--bull)' : 'var(--bear)' }}>
        {isUp ? '▲' : '▼'} {isUp ? '+' : ''}{formatPrice(price.change)} ({isUp ? '+' : ''}{price.change_pct.toFixed(2)}%)
      </div>
      {/* Day range bar */}
      <div className="mt-2">
        <div className="h-[3px] bg-bg3 rounded-[2px] relative" style={{ marginTop: 6 }}>
          <div
            className="absolute inset-0 rounded-[2px] opacity-35"
            style={{ background: 'linear-gradient(90deg,var(--bear),var(--gold),var(--bull))' }}
          />
          <div
            className="absolute top-[-3px] w-[2px] h-[9px] bg-gold rounded-[1px]"
            style={{ left: `calc(${rangePct}% - 1px)` }}
          />
        </div>
        <div className="flex justify-between font-mono text-[9px] text-t3 mt-[3px]">
          <span style={{ color: 'var(--bear)' }}>{formatPrice(price.day_low, 0)}</span>
          <span>DAY RANGE</span>
          <span style={{ color: 'var(--bull)' }}>{formatPrice(price.day_high, 0)}</span>
        </div>
      </div>
      {/* Bid / Ask */}
      <div className="flex gap-3 mt-1">
        <div className="flex items-center gap-1">
          <span className="text-[8px] uppercase text-t3 tracking-[0.08em]">Bid</span>
          <span className="font-mono text-[10px] text-t2">{formatPrice(price.bid)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[8px] uppercase text-t3 tracking-[0.08em]">Ask</span>
          <span className="font-mono text-[10px] text-t2">{formatPrice(price.ask)}</span>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <div
            className="w-[5px] h-[5px] rounded-full"
            style={{ background: price.live ? 'var(--bull)' : 'var(--t3)', animation: price.live ? 'pulse2 2s ease infinite' : 'none' }}
          />
          <span className="text-[8px] text-t3 font-mono">{price.source}</span>
        </div>
      </div>
    </div>
  )
}
