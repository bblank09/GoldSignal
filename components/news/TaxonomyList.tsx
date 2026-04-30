'use client'

import { useState } from 'react'
import type { TaxonomyEntry } from '@/lib/types'
import ImpactBadge from '@/components/ui/ImpactBadge'

interface Props { taxonomy: TaxonomyEntry[] }

export default function TaxonomyList({ taxonomy }: Props) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <div className="px-3 py-3">
      <p className="text-[12px] text-t2 leading-[1.65] mb-4 px-3 py-2.5 rounded-[3px] border-l-2"
        style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderLeftColor: 'var(--gold)' }}>
        Gold is driven by a hierarchy of macro forces. Understanding which driver is dominant determines whether news is actionable or noise.
      </p>
      <div className="flex flex-col gap-2">
        {taxonomy.map((tx) => {
          const isOpen = openId === tx.id
          return (
            <div
              key={tx.id}
              className="border border-bdr rounded-[3px] overflow-hidden cursor-pointer transition-colors"
              style={{ background: 'var(--bg1)' }}
            >
              <div className="flex items-center gap-2.5 px-3 py-2.5" onClick={() => setOpenId(isOpen ? null : tx.id)}>
                <div
                  className="w-8 h-8 rounded-[3px] flex items-center justify-center text-[16px] flex-shrink-0"
                  style={{ background: tx.iconBg }}
                >
                  {tx.icon}
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-t1 mb-[2px]">{tx.name}</div>
                  <div className="text-[11px] text-t2">{tx.tagline}</div>
                </div>
                <div className="flex gap-1 items-center">
                  <ImpactBadge level={tx.impactLevel} />
                  <span
                    className="text-[9px] font-bold tracking-[0.06em] px-[6px] py-[2px] rounded-[2px]"
                    style={{
                      background: tx.goldDir === 'bull' ? 'var(--bullbg)' : tx.goldDir === 'bear' ? 'var(--bearbg)' : 'var(--ambbg)',
                      color: tx.goldDir === 'bull' ? 'var(--bull)' : tx.goldDir === 'bear' ? 'var(--bear)' : 'var(--amb)',
                      border: `1px solid ${tx.goldDir === 'bull' ? 'var(--bull2)' : tx.goldDir === 'bear' ? 'var(--bear2)' : '#78350F'}`,
                    }}
                  >
                    {tx.goldDir === 'bull' ? 'BULLISH' : tx.goldDir === 'bear' ? 'BEARISH' : 'MIXED'}
                  </span>
                </div>
              </div>

              {isOpen && (
                <div className="px-3 pb-3" onClick={(e) => e.stopPropagation()}>
                  <p className="text-[12px] text-t2 leading-[1.65] mb-2.5">{tx.desc}</p>
                  <div className="mb-2.5">
                    <div className="text-[9px] uppercase tracking-[0.12em] text-t3 mb-1.5 font-semibold">Mechanism</div>
                    {tx.mechanism.map((m, i) => (
                      <div key={i} className="flex items-start gap-2 mb-[5px]">
                        <span className="text-[10px] font-bold w-4 flex-shrink-0 mt-[1px]"
                          style={{ color: m.dir === '▲' ? 'var(--bull)' : 'var(--bear)' }}>{m.dir}</span>
                        <span className="text-[11px] text-t2 leading-[1.5]">{m.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                    {tx.historicalMoves.map((hm) => (
                      <div key={hm.ev} className="bg-bg2 border border-bdr rounded-[2px] px-[7px] py-[5px]">
                        <div className="text-[10px] font-semibold text-t1 mb-[2px]">{hm.ev}</div>
                        <div className="font-mono text-[12px] font-semibold"
                          style={{ color: hm.move.startsWith('+') ? 'var(--bull)' : 'var(--bear)' }}>{hm.move}</div>
                        <div className="text-[9px] text-t3">{hm.date}</div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-bg3 border border-bdr2 rounded-[2px] px-2 py-1.5 flex items-center gap-2.5">
                    <span className="text-[9px] text-t3 uppercase tracking-[0.08em] w-20">{tx.current.label}</span>
                    <span className="font-mono text-[12px] font-semibold flex-1">{tx.current.val}</span>
                    <span className="text-[10px] font-bold" style={{ color: tx.current.signalColor }}>{tx.current.signal}</span>
                  </div>
                  <div className="text-[9px] text-t3 mt-1">{tx.current.note}</div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
