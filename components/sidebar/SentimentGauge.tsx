interface Props {
  bullish: number
  bearish: number
  neutral: number
}

export default function SentimentGauge({ bullish, bearish, neutral }: Props) {
  return (
    <div className="border-b border-bdr px-3 py-2.5">
      <div className="text-[9px] tracking-[0.14em] uppercase text-t3 mb-[7px] font-semibold">24H Sentiment</div>
      <div className="flex justify-between font-mono text-[10px] mb-[3px]">
        <span style={{ color: 'var(--bull)' }}>{bullish}% Bull</span>
        <span className="text-t3">{neutral}%</span>
        <span style={{ color: 'var(--bear)' }}>{bearish}% Bear</span>
      </div>
      <div className="flex h-[5px] rounded-[3px] overflow-hidden">
        <div style={{ width: `${bullish}%`, background: 'var(--bull)' }} />
        <div style={{ width: `${neutral}%`, background: 'var(--amb)' }} />
        <div style={{ width: `${bearish}%`, background: 'var(--bear)' }} />
      </div>
    </div>
  )
}
