'use client'

import type { BiasDirection } from '@/lib/types'

export interface LiveForecast {
  institution: string
  analyst: string | null
  target: number
  timeframe: string
  bias: BiasDirection
  rationale: string
  source: string
  last_updated: string
  confidence: 'HIGH' | 'MEDIUM' | 'LOW'
}

interface Props { forecasts: LiveForecast[] }

const CONF_STYLE: Record<string, { bg: string; color: string; border: string; label: string }> = {
  HIGH:   { bg: '#1A1A2E', color: '#A78BFA', border: '#4C1D95', label: 'HIGH CONFIDENCE' },
  MEDIUM: { bg: '#0D1A30', color: '#93C5FD', border: '#1E3A5F', label: 'MEDIUM CONFIDENCE' },
  LOW:    { bg: '#1A1D24', color: 'var(--t2)', border: 'var(--bdr2)', label: 'LOW CONFIDENCE' },
}

export default function ForecastsTable({ forecasts }: Props) {
  const bullish = forecasts.filter((f) => f.bias === 'Bullish').length
  const bullPct = forecasts.length > 0 ? Math.round((bullish / forecasts.length) * 100) : 0

  const groups = (['HIGH', 'MEDIUM', 'LOW'] as const).map((conf) => ({
    confidence: conf,
    rows: forecasts.filter((f) => f.confidence === conf),
  }))

  return (
    <div className="px-3 py-3">
      <div
        className="text-[12px] text-t2 leading-[1.65] mb-3.5 px-3 py-2.5 rounded-[3px] flex gap-4 items-start"
        style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)', borderLeftColor: 'var(--gold)', borderLeftWidth: 2 }}
      >
        <div className="flex-1">
          Institutional gold price forecasts compiled from major banks and research houses. Updated via AI analysis of latest research notes. Sources cited for each forecast.
        </div>
        <div className="flex gap-0">
          <div className="flex flex-col gap-[2px] flex-shrink-0 px-3 border-l border-bdr2">
            <span className="font-mono text-[18px] font-semibold" style={{ color: bullPct >= 60 ? 'var(--bull)' : 'var(--t1)' }}>
              {bullPct}%
            </span>
            <span className="text-[9px] text-t3 uppercase tracking-[0.09em]">Bullish</span>
          </div>
        </div>
      </div>

      {groups.map(({ confidence, rows }) => {
        if (!rows.length) return null
        const cs = CONF_STYLE[confidence]
        return (
          <div key={confidence}>
            <div className="flex items-center gap-2 my-2.5">
              <span
                className="text-[10px] font-bold tracking-[0.08em] px-2 py-[2px] rounded-[2px]"
                style={{ background: cs.bg, color: cs.color, border: `1px solid ${cs.border}` }}
              >
                {cs.label}
              </span>
              <span className="text-[10px] text-t3">{rows.length} forecast{rows.length > 1 ? 's' : ''}</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8 }}>
              <thead>
                <tr>
                  {['Institution', 'Target', 'Timeframe', 'Bias', 'Rationale', 'Source', 'Updated'].map((h) => (
                    <th key={h} className="text-[9px] text-t3 uppercase tracking-[0.09em] px-2 py-[5px] text-left font-semibold"
                      style={{ borderBottom: '1px solid var(--bdr)', background: 'var(--bg2)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => (
                  <tr key={`${row.institution}-${i}`} className="group">
                    <td className="px-2 py-[7px] border-b border-bdr group-hover:bg-bg2">
                      <div className="text-[12px] font-semibold text-t1">{row.institution}</div>
                      {row.analyst && <div className="text-[9px] text-t3 mt-[1px]">{row.analyst}</div>}
                    </td>
                    <td className="px-2 py-[7px] border-b border-bdr group-hover:bg-bg2 font-mono text-[12px] font-semibold text-t1">
                      ${row.target.toLocaleString()}
                    </td>
                    <td className="px-2 py-[7px] border-b border-bdr group-hover:bg-bg2 text-[10px] text-t2">
                      {row.timeframe}
                    </td>
                    <td className="px-2 py-[7px] border-b border-bdr group-hover:bg-bg2">
                      <span
                        className="text-[10px] font-bold px-[6px] py-[2px] rounded-[2px] tracking-[0.06em]"
                        style={{
                          background: row.bias === 'Bullish' ? 'var(--bullbg)' : row.bias === 'Bearish' ? 'var(--bearbg)' : 'var(--ambbg)',
                          color: row.bias === 'Bullish' ? 'var(--bull)' : row.bias === 'Bearish' ? 'var(--bear)' : 'var(--amb)',
                          border: `1px solid ${row.bias === 'Bullish' ? 'var(--bull2)' : row.bias === 'Bearish' ? 'var(--bear2)' : '#78350F'}`,
                        }}
                      >
                        {row.bias.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-2 py-[7px] border-b border-bdr group-hover:bg-bg2 text-[10px] text-t2 max-w-[220px] leading-[1.4]">
                      {row.rationale}
                    </td>
                    <td className="px-2 py-[7px] border-b border-bdr group-hover:bg-bg2 text-[9px] text-t3 max-w-[140px] leading-[1.3]">
                      📄 {row.source}
                    </td>
                    <td className="px-2 py-[7px] border-b border-bdr group-hover:bg-bg2 font-mono text-[9px] text-t3">
                      {row.last_updated}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      })}

      <div className="mt-3 px-2 py-1.5 rounded-[3px] text-[9px] text-t3 leading-[1.5]" style={{ background: 'var(--bg2)', border: '1px solid var(--bdr)' }}>
        ⚠️ Forecasts are compiled from publicly available institutional research notes and may not reflect the most current views. Always verify with primary sources. Last compiled: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}.
      </div>
    </div>
  )
}
