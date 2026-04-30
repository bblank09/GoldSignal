import type { ImpactLevel } from '@/lib/types'

const STYLES: Record<ImpactLevel, { bg: string; text: string; dot: string }> = {
  HIGH:   { bg: '#7F1D1D', text: '#FCA5A5', dot: '#EF4444' },
  MEDIUM: { bg: '#78350F', text: '#FDE68A', dot: '#F59E0B' },
  LOW:    { bg: '#1E3A5F', text: '#93C5FD', dot: '#3B82F6' },
}

interface Props {
  level: ImpactLevel
  score?: number
}

export default function ImpactBadge({ level, score }: Props) {
  const s = STYLES[level]
  return (
    <span
      className="inline-flex items-center gap-[3px] px-[5px] py-[2px] rounded-[2px] text-[9px] font-bold tracking-[0.08em]"
      style={{ background: s.bg, color: s.text }}
    >
      <span className="w-1 h-1 rounded-full inline-block" style={{ background: s.dot }} />
      {level}{score !== undefined ? ` ${score}/10` : ''}
    </span>
  )
}
