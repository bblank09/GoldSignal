interface Props { label: string }

export default function FactorTag({ label }: Props) {
  return (
    <span className="px-[6px] py-[2px] border border-bdr2 rounded-[10px] text-[9px] text-t2">
      {label}
    </span>
  )
}
