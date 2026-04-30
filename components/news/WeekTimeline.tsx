'use client'

import { useState } from 'react'
import type { WeekDay } from '@/lib/types'
import ImpactBadge from '@/components/ui/ImpactBadge'

interface Props { days: WeekDay[] }

export default function WeekTimeline({ days }: Props) {
  const [openEvent, setOpenEvent] = useState<string | null>(null)

  return (
    <div className="px-3 py-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[14px] font-semibold text-t1">This Week</span>
        <span className="text-[11px] text-t2">Economic Events</span>
      </div>
      <div className="flex flex-col">
        {days.map((day) => (
          <div key={day.day} className="flex gap-0 relative">
            {/* Day label */}
            <div className="w-[80px] flex-shrink-0 px-0 pr-3 py-3 text-right">
              <div
                className="text-[11px] font-semibold"
                style={{ color: day.today ? 'var(--gold)' : 'var(--t2)' }}
              >
                {day.day}
              </div>
              <div className="font-mono text-[10px] text-t3">{day.date}</div>
            </div>

            {/* Spine */}
            <div className="flex flex-col items-center flex-shrink-0 w-6">
              <div
                className="w-[10px] h-[10px] rounded-full flex-shrink-0 mt-[14px] border-2"
                style={{ borderColor: day.today ? 'var(--gold)' : day.past ? 'var(--bdr2)' : 'var(--t3)', background: day.today ? 'var(--gold)' : 'transparent' }}
              />
              <div className="flex-1 w-px bg-bdr2" />
            </div>

            {/* Events */}
            <div className="flex-1 py-2 pb-4 pl-3 flex flex-col gap-[5px]">
              {day.events.length === 0 && (
                <p className="text-[11px] text-t3 italic py-2.5">No major events</p>
              )}
              {day.events.map((ev, ei) => {
                const evKey = `${day.day}-${ei}`
                const isOpen = openEvent === evKey
                return (
                  <div
                    key={evKey}
                    className={`border border-bdr rounded-[3px] overflow-hidden cursor-pointer transition-colors ${day.past ? 'opacity-60' : ''}`}
                    style={{ background: 'var(--bg1)' }}
                    onClick={() => setOpenEvent(isOpen ? null : evKey)}
                  >
                    <div className="flex items-center gap-[7px] px-[10px] py-[7px]">
                      <span className="font-mono text-[10px] text-t3 w-9 flex-shrink-0">{ev.time}</span>
                      <ImpactBadge level={ev.imp} />
                      <span className="text-[12px] font-semibold text-t1 flex-1">{ev.name}</span>
                      <span className="text-[10px] text-t2">{ev.country}</span>
                    </div>
                    <div className="flex gap-3 px-[10px] pb-[7px] ml-[43px]">
                      {ev.actual !== null && (
                        <div className="flex flex-col gap-[1px]">
                          <span className="text-[8px] text-t3 uppercase tracking-[0.08em]">Actual</span>
                          <span className="font-mono text-[11px] font-medium" style={{ color: 'var(--bull)' }}>{ev.actual}</span>
                        </div>
                      )}
                      <div className="flex flex-col gap-[1px]">
                        <span className="text-[8px] text-t3 uppercase tracking-[0.08em]">Forecast</span>
                        <span className="font-mono text-[11px] font-medium text-t1">{ev.fore}</span>
                      </div>
                      <div className="flex flex-col gap-[1px]">
                        <span className="text-[8px] text-t3 uppercase tracking-[0.08em]">Previous</span>
                        <span className="font-mono text-[11px] font-medium text-t2">{ev.prev}</span>
                      </div>
                    </div>

                    {isOpen && (
                      <div className="px-[10px] pb-[8px] ml-[43px]" onClick={(e) => e.stopPropagation()}>
                        <p className="text-[10px] text-t2 mb-2">{ev.hist}</p>
                        <div className="grid grid-cols-3 gap-[5px] mb-2">
                          {[
                            { label: 'BULL', cls: 'bullbg', col: 'var(--bull)', bc: 'var(--bull2)', ...ev.bull },
                            { label: 'BASE', cls: 'bg3',   col: 'var(--t1)',  bc: 'var(--bdr2)', ...ev.base },
                            { label: 'BEAR', cls: 'bearbg',col: 'var(--bear)',bc: 'var(--bear2)',...ev.bear },
                          ].map((sc) => (
                            <div key={sc.label} className="rounded-[2px] px-[7px] py-[5px] border" style={{ background: `var(--${sc.cls})`, borderColor: sc.bc }}>
                              <div className="text-[8px] font-bold uppercase tracking-[0.1em] mb-[2px]" style={{ color: sc.col }}>{sc.label}</div>
                              <div className="font-mono text-[12px] font-semibold" style={{ color: sc.col }}>{sc.price}</div>
                              <div className="text-[9px] text-t2 mt-[2px] leading-[1.35]">{sc.desc}</div>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                          {ev.histMoves.map((hm) => (
                            <div key={hm.ev} className="flex items-center gap-1 text-[9px]">
                              <span className="font-mono text-t3">{hm.ev}</span>
                              <span className="font-mono font-semibold" style={{ color: hm.move.startsWith('+') ? 'var(--bull)' : 'var(--bear)' }}>{hm.move}</span>
                              <span className="text-t3">({hm.outcome})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
