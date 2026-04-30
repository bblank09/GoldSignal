import type { Sentiment } from '@/lib/types'

const MAP: Record<Sentiment, { glyph: string; color: string }> = {
  Bullish: { glyph: '▲', color: 'var(--bull)' },
  Bearish: { glyph: '▼', color: 'var(--bear)' },
  Neutral: { glyph: '◆', color: 'var(--amb)' },
}

interface Props { sentiment: Sentiment }

export default function SentimentBadge({ sentiment }: Props) {
  const m = MAP[sentiment]
  return (
    <span className="text-[10px] font-bold" style={{ color: m.color }}>
      {m.glyph} {sentiment.toUpperCase()}
    </span>
  )
}
