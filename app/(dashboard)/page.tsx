'use client'

import { useState, useEffect, useMemo } from 'react'
import NewsFeed from '@/components/news/NewsFeed'
import WeekTimeline from '@/components/news/WeekTimeline'
import TaxonomyList from '@/components/news/TaxonomyList'
import ForecastsTable from '@/components/news/ForecastsTable'
import { useNews } from '@/lib/hooks/use-news'
import { useUIStore } from '@/lib/store/ui-store'
import { buildTaxonomy } from '@/lib/build-taxonomy'
import type { LiveForecast } from '@/components/news/ForecastsTable'
import type { WeekDay, MacroSnapshot, TaxonomyEntry } from '@/lib/types'

const TABS = [
  { key: 'today',     label: 'Today',     badge: true  },
  { key: 'week',      label: 'Week',      badge: false },
  { key: 'taxonomy',  label: 'Taxonomy',  badge: false },
  { key: 'forecasts', label: 'Forecasts', badge: false },
] as const

type Tab = (typeof TABS)[number]['key']

function LiveNewsFeed() {
  const activeCategoryId = useUIStore((s) => s.activeCategoryId)
  const { articles, loading } = useNews(activeCategoryId ?? undefined)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <span className="text-[11px] font-mono" style={{ color: 'var(--t3)' }}>Loading news...</span>
      </div>
    )
  }

  if (articles.length === 0) {
    return (
      <div className="flex items-center justify-center p-10">
        <span className="text-[11px] font-mono" style={{ color: 'var(--t3)' }}>No analyzed articles yet. Run the news cron to fetch and analyze.</span>
      </div>
    )
  }

  return <NewsFeed articles={articles} />
}

function LiveWeekTab() {
  const [days, setDays] = useState<WeekDay[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/calendar?days=30')
      .then((r) => r.ok ? r.json() : [])
      .then((events) => {
        if (!events?.length) { setLoading(false); return }
        const grouped: Record<string, WeekDay> = {}
        const today = new Date().toISOString().split('T')[0]
        for (const ev of events) {
          const d = ev.iso_date?.split('T')[0] ?? ''
          if (!grouped[d]) {
            const dt = new Date(d)
            grouped[d] = {
              day:    dt.toLocaleDateString('en-US', { weekday: 'short' }),
              date:   dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              today:  d === today,
              past:   d < today,
              events: [],
            }
          }
          grouped[d].events.push({
            time:      ev.iso_date ? new Date(ev.iso_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--',
            name:      ev.event,
            country:   ev.country,
            imp:       ev.importance,
            fore:      ev.forecast  ?? '--',
            prev:      ev.previous  ?? '--',
            actual:    ev.actual    ?? null,
            hist:      '',
            bull:      { price: '', desc: '' },
            base:      { price: '', desc: '' },
            bear:      { price: '', desc: '' },
            histMoves: [],
          })
        }
        const sorted = Object.entries(grouped)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([, v]) => v)
        setDays(sorted)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <span className="text-[11px] font-mono" style={{ color: 'var(--t3)' }}>Loading calendar...</span>
      </div>
    )
  }

  if (days.length === 0) {
    return (
      <div className="flex items-center justify-center p-10">
        <span className="text-[11px] font-mono" style={{ color: 'var(--t3)' }}>No events in next 30 days.</span>
      </div>
    )
  }

  return <WeekTimeline days={days} />
}

function LiveTaxonomyTab() {
  const [macro, setMacro]     = useState<MacroSnapshot | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/macro')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setMacro(d) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const taxonomy: TaxonomyEntry[] = useMemo(() => buildTaxonomy(macro ?? undefined), [macro])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <span className="text-[11px] font-mono" style={{ color: 'var(--t3)' }}>
          Fetching live macro data…
        </span>
      </div>
    )
  }

  return <TaxonomyList taxonomy={taxonomy} />
}

function LiveForecastsTab() {
  const [forecasts, setForecasts] = useState<LiveForecast[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/forecasts')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setForecasts(data)
        }
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-10">
        <div className="text-center">
          <div className="text-[14px] font-mono mb-2" style={{ color: 'var(--gold)' }}>⏳ Generating Forecasts...</div>
          <span className="text-[11px] font-mono" style={{ color: 'var(--t3)' }}>Compiling institution forecasts via AI (10-15s)</span>
        </div>
      </div>
    )
  }

  if (error || forecasts.length === 0) {
    return (
      <div className="flex items-center justify-center p-10">
        <span className="text-[11px] font-mono" style={{ color: 'var(--t3)' }}>
          {error ? `Error: ${error}` : 'No forecasts available'}
        </span>
      </div>
    )
  }

  return <ForecastsTable forecasts={forecasts} />
}

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<Tab>('today')

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Tab bar */}
      <div
        className="flex flex-shrink-0 px-[14px]"
        style={{ borderBottom: '1px solid var(--bdr)', background: 'var(--bg1)' }}
      >
        {TABS.map(({ key, label, badge }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className="flex items-center gap-[5px] px-4 h-10 text-[12px] font-medium border-b-2 transition-colors cursor-pointer"
            style={{
              borderBottomColor: activeTab === key ? 'var(--gold)' : 'transparent',
              color: activeTab === key ? 'var(--t1)' : 'var(--t2)',
              fontWeight: activeTab === key ? 600 : 500,
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${activeTab === key ? 'var(--gold)' : 'transparent'}`,
            }}
          >
            {label}
            {badge && key === 'today' && (
              <span
                className="font-mono text-[9px] px-[6px] py-[1px] rounded-[10px]"
                style={{ background: 'var(--bg3)', color: 'var(--t3)' }}
              >
                ●
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'today'     && <LiveNewsFeed />}
        {activeTab === 'week'      && <LiveWeekTab />}
        {activeTab === 'taxonomy'  && <LiveTaxonomyTab />}
        {activeTab === 'forecasts' && <LiveForecastsTab />}
      </div>
    </div>
  )
}
