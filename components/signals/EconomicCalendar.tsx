import type { EconomicEvent } from '@/lib/types'
import ImpactBadge from '@/components/ui/ImpactBadge'

interface Props { events: EconomicEvent[] }

export default function EconomicCalendar({ events }: Props) {
  return (
    <div
      className="rounded-[3px] overflow-hidden"
      style={{ background: 'var(--bg1)', border: '1px solid var(--bdr)' }}
    >
      <div className="flex items-center gap-2 px-3 py-2" style={{ borderBottom: '1px solid var(--bdr)' }}>
        <span className="text-[11px] font-semibold text-t1">📆 Economic Calendar</span>
        <span className="text-[9px] text-t3">Next 7 days</span>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Date', 'Event', 'Country', 'Importance', 'Forecast', 'Previous', 'Gold Impact'].map((h) => (
              <th
                key={h}
                className="text-[9px] text-t3 uppercase tracking-[0.09em] px-2.5 py-1.5 text-left font-semibold"
                style={{ borderBottom: '1px solid var(--bdr)', background: 'var(--bg2)' }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {events.map((ev) => (
            <tr
              key={ev.id}
              className="group"
              style={{ background: ev.date.toLowerCase().includes('wed apr 30') ? 'var(--ambbg)' : undefined }}
            >
              <td className="px-2.5 py-[7px] border-b border-bdr font-mono text-[10px] text-t3 group-hover:bg-bg2">{ev.date}</td>
              <td className="px-2.5 py-[7px] border-b border-bdr text-[11px] text-t1 font-semibold group-hover:bg-bg2">{ev.event}</td>
              <td className="px-2.5 py-[7px] border-b border-bdr text-[11px] text-t2 group-hover:bg-bg2">{ev.country}</td>
              <td className="px-2.5 py-[7px] border-b border-bdr group-hover:bg-bg2">
                <ImpactBadge level={ev.importance} />
              </td>
              <td className="px-2.5 py-[7px] border-b border-bdr font-mono text-[11px] text-t1 group-hover:bg-bg2">{ev.forecast}</td>
              <td className="px-2.5 py-[7px] border-b border-bdr font-mono text-[11px] text-t2 group-hover:bg-bg2">{ev.previous}</td>
              <td className="px-2.5 py-[7px] border-b border-bdr text-[10px] text-t2 italic group-hover:bg-bg2">{ev.gold_impact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
