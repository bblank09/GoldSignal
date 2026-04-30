import type { NewsPin } from '@/lib/types'

interface Props {
  pin: NewsPin
  x: number
  y: number
}

export default function ChartNewsPopup({ pin, x, y }: Props) {
  return (
    <div
      className="absolute z-50 rounded-[3px] px-[10px] py-2 text-[11px] pointer-events-none"
      style={{
        left: x,
        top: y,
        width: 220,
        background: 'var(--bg2)',
        border: '1px solid var(--bdr2)',
        transform: 'translate(-50%, -110%)',
      }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        <span
          className="text-[9px] font-bold px-[4px] py-[1px] rounded-[2px]"
          style={{
            background: pin.impact === 'HIGH' ? '#7F1D1D' : pin.impact === 'MEDIUM' ? '#78350F' : '#1E3A5F',
            color: pin.impact === 'HIGH' ? '#FCA5A5' : pin.impact === 'MEDIUM' ? '#FDE68A' : '#93C5FD',
          }}
        >
          {pin.impact}
        </span>
        <span className="font-mono text-[9px] text-t3">{pin.time}</span>
        <span className="font-mono text-[9px] ml-auto" style={{ color: 'var(--bull)' }}>{pin.price_effect}</span>
      </div>
      <p className="text-[11px] text-t1 leading-[1.35]">{pin.title}</p>
      {/* Arrow */}
      <div
        className="absolute"
        style={{
          bottom: -6,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: '6px solid var(--bdr2)',
        }}
      />
    </div>
  )
}
