interface Props { value: 1 | 2 | 3 | 4 | 5 }

export default function StrengthBars({ value }: Props) {
  return (
    <div className="flex gap-[2px] items-end">
      {([1, 2, 3, 4, 5] as const).map((i) => (
        <div
          key={i}
          style={{
            width: 14,
            height: 5 + i * 2,
            borderRadius: 1,
            background: i <= value ? 'var(--bull)' : 'var(--bg3)',
          }}
        />
      ))}
    </div>
  )
}
