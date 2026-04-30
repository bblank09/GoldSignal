interface Props {
  label: string
  children: React.ReactNode
  accentColor?: string
}

export default function StatCard({ label, children, accentColor = 'var(--gold)' }: Props) {
  return (
    <div
      className="rounded-[3px] px-3 py-3 relative overflow-hidden"
      style={{ background: 'var(--bg1)', border: '1px solid var(--bdr)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: accentColor }} />
      <div className="text-[9px] text-t3 uppercase tracking-[0.12em] mb-2 font-semibold">{label}</div>
      {children}
    </div>
  )
}
