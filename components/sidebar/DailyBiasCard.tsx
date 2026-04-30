import type { DailySignal } from '@/lib/types'
import BiasBadge from '@/components/ui/BiasBadge'
import StrengthBars from '@/components/ui/StrengthBars'

interface Props { signal: DailySignal }

export default function DailyBiasCard({ signal }: Props) {
  return (
    <div className="border-b border-bdr px-3 py-2.5">
      <div className="text-[9px] tracking-[0.14em] uppercase text-t3 mb-[7px] font-semibold">Today&apos;s Bias</div>
      <BiasBadge bias={signal.bias} />
      <div className="mt-[6px]">
        <StrengthBars value={signal.strength} />
      </div>
      <div className="text-[10px] text-t2 leading-[1.55] mt-[6px]">{signal.executive_summary}</div>
    </div>
  )
}
