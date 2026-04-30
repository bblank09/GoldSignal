interface Props { value: number }

export default function ConfidenceBar({ value }: Props) {
  return (
    <div className="flex items-center gap-[7px] mt-[6px]">
      <div className="flex-1 h-[2px] bg-bg3 rounded-[2px] overflow-hidden">
        <div className="h-full bg-gold rounded-[2px]" style={{ width: `${value * 100}%` }} />
      </div>
      <span className="font-mono text-[9px] text-t2">{value.toFixed(2)}</span>
    </div>
  )
}
