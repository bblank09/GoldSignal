import type { BiasDirection } from '@/lib/types'

interface Props { bias: BiasDirection }

export default function BiasBadge({ bias }: Props) {
  if (bias === 'Bullish') {
    return (
      <span
        className="inline-flex items-center gap-[5px] px-[10px] py-1 rounded-[3px] text-[12px] font-bold tracking-[0.08em]"
        style={{ background: 'var(--bullbg)', border: '1px solid var(--bull2)', color: 'var(--bull)' }}
      >
        ▲ BULLISH
      </span>
    )
  }
  if (bias === 'Bearish') {
    return (
      <span
        className="inline-flex items-center gap-[5px] px-[10px] py-1 rounded-[3px] text-[12px] font-bold tracking-[0.08em]"
        style={{ background: 'var(--bearbg)', border: '1px solid var(--bear2)', color: 'var(--bear)' }}
      >
        ▼ BEARISH
      </span>
    )
  }
  return (
    <span
      className="inline-flex items-center gap-[5px] px-[10px] py-1 rounded-[3px] text-[12px] font-bold tracking-[0.08em]"
      style={{ background: 'var(--ambbg)', border: '1px solid #78350F', color: 'var(--amb)' }}
    >
      ◆ NEUTRAL
    </span>
  )
}
