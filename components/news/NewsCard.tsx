'use client'

import type { ArticleWithAnalysis } from '@/lib/types'
import { formatTimeAgo } from '@/lib/format'
import ImpactBadge from '@/components/ui/ImpactBadge'
import SentimentBadge from '@/components/ui/SentimentBadge'
import FactorTag from '@/components/ui/FactorTag'

interface Props {
  item: ArticleWithAnalysis
  expanded: boolean
  onToggle: () => void
}

const ACCENT_COLORS = { HIGH: '#EF4444', MEDIUM: '#F59E0B', LOW: '#3B82F6' }

export default function NewsCard({ item, expanded, onToggle }: Props) {
  const { analysis } = item
  const accentColor = ACCENT_COLORS[analysis.impact_level]

  return (
    <div
      className="border border-bdr rounded-[3px] overflow-hidden cursor-pointer transition-colors animate-fi relative"
      style={{ background: 'var(--bg1)' }}
      onClick={onToggle}
    >
      {/* Left accent stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px]" style={{ background: accentColor }} />

      {/* Card body */}
      <div className="py-[9px] pr-[11px] pl-[13px]">
        {/* Row 1: badges + meta */}
        <div className="flex items-center gap-[5px] mb-[6px] flex-wrap">
          <ImpactBadge level={analysis.impact_level} score={analysis.impact_score} />
          <SentimentBadge sentiment={analysis.sentiment} />
          <span className="text-[9px] text-t2 ml-auto font-mono whitespace-nowrap">
            {item.source} · {formatTimeAgo(item.published_at)}
          </span>
        </div>

        {/* Row 2: mini stats */}
        <div className="flex items-center gap-[5px] mb-[6px]">
          <div
            className="flex items-center gap-[3px] rounded-[2px] px-[5px] py-[1px] border border-bdr"
            style={{ background: 'var(--bg2)' }}
          >
            <span className="text-[8px] text-t3 uppercase tracking-[0.07em]">Bull</span>
            <span className="font-mono text-[9px] font-semibold" style={{ color: 'var(--bull)' }}>
              {Math.round(analysis.prob_bull * 100)}%
            </span>
          </div>
          <div
            className="flex items-center gap-[3px] rounded-[2px] px-[5px] py-[1px] border border-bdr"
            style={{ background: 'var(--bg2)' }}
          >
            <span className="text-[8px] text-t3 uppercase tracking-[0.07em]">Move</span>
            <span className="font-mono text-[9px] font-semibold text-t1">{analysis.expected_move}</span>
          </div>
        </div>

        {/* Row 3: title */}
        <div className="text-[13px] font-semibold text-t1 leading-[1.35] mb-[7px]">{item.title}</div>

        {/* Row 4: factor tags + expand */}
        <div className="flex items-center gap-1 flex-wrap">
          {item.factors.map((f) => <FactorTag key={f} label={f} />)}
          <span className="ml-auto text-[9px] text-t3 font-mono">{expanded ? '↑ Less' : '↓ View'}</span>
        </div>
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div
          className="border-t border-bdr px-[13px] py-[10px]"
          style={{ background: 'var(--bg0)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[8px] tracking-[0.14em] uppercase text-t3 mb-2 font-semibold">AI Analysis</div>

          {/* Summary */}
          <div className="mb-[10px]">
            <div className="text-[8px] uppercase tracking-[0.1em] text-t3 mb-1">Summary</div>
            <p className="text-[12px] text-t2 leading-[1.65]">{analysis.summary}</p>
          </div>

          {/* Action */}
          <div
            className="rounded-[2px] px-[9px] py-[7px] mb-[10px]"
            style={{ background: 'var(--bg2)', border: '1px solid var(--bdr2)', borderLeft: '2px solid var(--gold)' }}
          >
            <div className="text-[8px] uppercase tracking-[0.1em] mb-[3px]" style={{ color: 'var(--gold2)' }}>What To Do Now</div>
            <p className="text-[12px] text-t1 leading-[1.6]">{analysis.action_points}</p>
          </div>

          {/* Bull / Base / Bear */}
          <div className="grid grid-cols-3 gap-[6px] mt-[6px] mb-[10px]">
            <div className="rounded-[2px] px-2 py-[6px] border" style={{ background: 'var(--bullbg)', borderColor: 'var(--bull2)' }}>
              <div className="text-[8px] font-bold uppercase tracking-[0.1em] mb-1" style={{ color: 'var(--bull)' }}>Bull</div>
              <div className="font-mono text-[13px] font-semibold" style={{ color: 'var(--bull)' }}>${analysis.bull_case.price.toLocaleString()}</div>
              <div className="text-[10px] text-t2 mt-[3px] leading-[1.4]">{analysis.bull_case.description}</div>
            </div>
            <div className="rounded-[2px] px-2 py-[6px] border border-bdr2" style={{ background: 'var(--bg3)' }}>
              <div className="text-[8px] font-bold uppercase tracking-[0.1em] mb-1 text-t2">Base</div>
              <div className="font-mono text-[13px] font-semibold text-t1">${analysis.base_case.price.toLocaleString()}</div>
              <div className="text-[10px] text-t2 mt-[3px] leading-[1.4]">{analysis.base_case.description}</div>
            </div>
            <div className="rounded-[2px] px-2 py-[6px] border" style={{ background: 'var(--bearbg)', borderColor: 'var(--bear2)' }}>
              <div className="text-[8px] font-bold uppercase tracking-[0.1em] mb-1" style={{ color: 'var(--bear)' }}>Bear</div>
              <div className="font-mono text-[13px] font-semibold" style={{ color: 'var(--bear)' }}>${analysis.bear_case.price.toLocaleString()}</div>
              <div className="text-[10px] text-t2 mt-[3px] leading-[1.4]">{analysis.bear_case.description}</div>
            </div>
          </div>

          {/* Key levels */}
          <div className="grid grid-cols-2 gap-2 mb-[10px]">
            <div>
              <div className="text-[8px] uppercase tracking-[0.08em] text-t3 mb-1">Support</div>
              {analysis.key_levels.support.map((lvl) => (
                <span key={lvl} className="font-mono text-[11px] font-medium text-t1 block py-[2px]">${lvl.toLocaleString()}</span>
              ))}
            </div>
            <div>
              <div className="text-[8px] uppercase tracking-[0.08em] text-t3 mb-1">Resistance</div>
              {analysis.key_levels.resistance.map((lvl) => (
                <span key={lvl} className="font-mono text-[11px] font-medium text-t1 block py-[2px]">${lvl.toLocaleString()}</span>
              ))}
            </div>
          </div>

          {/* Confidence */}
          <div className="flex items-center gap-[7px]">
            <div className="text-[8px] uppercase tracking-[0.1em] text-t3">Confidence</div>
            <div className="flex-1 h-[2px] bg-bg3 rounded-[2px] overflow-hidden">
              <div className="h-full bg-gold rounded-[2px]" style={{ width: `${analysis.confidence * 100}%` }} />
            </div>
            <span className="font-mono text-[9px] text-t2">{analysis.confidence.toFixed(2)}</span>
          </div>

          {/* Sources */}
          <div className="mt-[6px]">
            <span className="text-[9px] text-t3 uppercase tracking-[0.08em]">Sources: </span>
            <span className="text-[9px] text-t2">{analysis.sources_cited.join(' · ')}</span>
          </div>

          {/* Read link */}
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 mt-[6px] text-[10px] font-mono"
            style={{ color: 'var(--blue)' }}
            onClick={(e) => e.stopPropagation()}
          >
            Read Original Article ↗
          </a>
        </div>
      )}
    </div>
  )
}
