import type { EconomicEvent } from '@/lib/types'
import { createAdminClient } from '@/lib/supabase/admin'

// Seeded calendar rows — in production these would come from a paid data API.
// The cron job upserts these; they are updated when actuals are released.
const SEED_EVENTS: Omit<EconomicEvent, 'id'>[] = [
  { date: 'Wed May 14', iso_date: '2026-05-14T12:30:00Z', event: 'US CPI (Apr)',         country: 'US', importance: 'HIGH',   forecast: '3.4%',  previous: '3.5%',  actual: null, gold_impact: 'Below forecast = bullish gold' },
  { date: 'Thu May 15', iso_date: '2026-05-15T12:30:00Z', event: 'US PPI (Apr)',          country: 'US', importance: 'HIGH',   forecast: '0.3%',  previous: '0.2%',  actual: null, gold_impact: 'Soft PPI = bullish via Fed cut odds' },
  { date: 'Thu May 15', iso_date: '2026-05-15T12:30:00Z', event: 'US Retail Sales (Apr)', country: 'US', importance: 'MEDIUM', forecast: '-0.1%', previous: '-0.3%', actual: null, gold_impact: 'Weak = bullish via USD weakness' },
  { date: 'Fri May 16', iso_date: '2026-05-16T14:00:00Z', event: 'US Consumer Sentiment', country: 'US', importance: 'MEDIUM', forecast: '76.2',  previous: '77.2',  actual: null, gold_impact: 'Low sentiment = mild safe haven bid' },
  { date: 'Wed May 21', iso_date: '2026-05-21T18:00:00Z', event: 'FOMC Meeting Minutes',  country: 'US', importance: 'HIGH',   forecast: 'N/A',   previous: 'N/A',   actual: null, gold_impact: 'Dovish tone = strongly bullish' },
  { date: 'Fri May 23', iso_date: '2026-05-23T12:30:00Z', event: 'US PCE Deflator (Apr)', country: 'US', importance: 'HIGH',   forecast: '2.7%',  previous: '2.7%',  actual: null, gold_impact: 'Below 2.7% = bullish for rate cut timing' },
]

export async function syncCalendar(): Promise<number> {
  const db = createAdminClient()
  let inserted = 0
  for (const ev of SEED_EVENTS) {
    const { error } = await db
      .from('economic_events')
      .upsert(
        { ...ev, date_label: ev.date },
        { onConflict: 'iso_date,event', ignoreDuplicates: true },
      )
    if (!error) inserted++
  }
  return inserted
}

export async function getUpcomingEvents(days = 7): Promise<EconomicEvent[]> {
  const db = createAdminClient()
  const from = new Date().toISOString()
  const to   = new Date(Date.now() + days * 86400_000).toISOString()

  const { data, error } = await db
    .from('economic_events')
    .select('*')
    .gte('iso_date', from)
    .lte('iso_date', to)
    .order('iso_date', { ascending: true })

  if (error) throw error
  return (data ?? []).map((r) => ({
    id:          r.id as string,
    date:        r.date_label as string,
    iso_date:    r.iso_date as string,
    event:       r.event as string,
    country:     r.country as string,
    importance:  r.importance as EconomicEvent['importance'],
    forecast:    r.forecast as string,
    previous:    r.previous as string,
    actual:      r.actual as string | null,
    gold_impact: r.gold_impact as string,
  }))
}
