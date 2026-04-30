interface Props {
  supporting: string[]
  risks: string[]
}

export default function RiskFactors({ supporting, risks }: Props) {
  return (
    <div
      className="rounded-[3px] overflow-hidden"
      style={{ background: 'var(--bg1)', border: '1px solid var(--bdr)' }}
    >
      <div className="flex items-center gap-1.5 px-3 py-2" style={{ borderBottom: '1px solid var(--bdr)' }}>
        <span className="text-[11px] font-semibold text-t1">⚖️ Factors</span>
      </div>
      <div className="px-3 py-2.5 grid grid-cols-2 gap-3">
        <div>
          <div className="text-[9px] uppercase tracking-[0.1em] font-semibold mb-1.5" style={{ color: 'var(--bull)' }}>Supporting</div>
          {supporting.map((f, i) => (
            <div key={i} className="flex items-start gap-[7px] py-[5px] border-b border-bdr last:border-b-0">
              <span className="text-[11px] font-bold flex-shrink-0 mt-[1px]" style={{ color: 'var(--bull)' }}>▲</span>
              <span className="text-[11px] text-t2 leading-[1.45]">{f}</span>
            </div>
          ))}
        </div>
        <div>
          <div className="text-[9px] uppercase tracking-[0.1em] font-semibold mb-1.5" style={{ color: 'var(--bear)' }}>Risks</div>
          {risks.map((f, i) => (
            <div key={i} className="flex items-start gap-[7px] py-[5px] border-b border-bdr last:border-b-0">
              <span className="text-[11px] font-bold flex-shrink-0 mt-[1px]" style={{ color: 'var(--bear)' }}>▼</span>
              <span className="text-[11px] text-t2 leading-[1.45]">{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
