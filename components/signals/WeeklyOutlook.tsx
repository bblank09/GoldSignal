import ImpactBadge from '@/components/ui/ImpactBadge'
import type { ImpactLevel } from '@/lib/types'

interface KeyEvent {
  date: string
  event: string
  imp: ImpactLevel
  note: string
}

interface Props {
  outlook: string
  keyEvents: KeyEvent[]
}

export default function WeeklyOutlook({ outlook, keyEvents }: Props) {
  return (
    <div
      className="rounded-[3px] overflow-hidden"
      style={{ background: 'var(--bg1)', border: '1px solid var(--bdr)' }}
    >
      <div className="flex items-center gap-1.5 px-3 py-2" style={{ borderBottom: '1px solid var(--bdr)' }}>
        <span className="text-[11px] font-semibold text-t1">📅 Weekly Outlook</span>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-[12px] text-t2 leading-[1.7] mb-2.5">{outlook}</p>
        <div className="text-[9px] uppercase tracking-[0.1em] text-t3 font-semibold mb-1.5">Key Events Ahead</div>
        {keyEvents.map((ev, i) => (
          <div key={i} className="flex items-start gap-2 py-[5px] border-b border-bdr last:border-b-0">
            <span className="font-mono text-[10px] text-t3 w-[70px] flex-shrink-0">{ev.date}</span>
            <ImpactBadge level={ev.imp} />
            <span className="text-[11px] text-t1 flex-1">{ev.event}</span>
            <span className="text-[10px] text-t2">{ev.note}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
